'use strict';

var app = require('../../app'),
  request = require('supertest'),
  expect = require('expect.js'),
  User = require('./../../api/user/user.model'),
  mongoose = require('mongoose'),
  config = require('./../../config/environment'),
  MongoClient = require('mongodb').MongoClient;

var toBeDelete,
  token = '',
  userId = '',
  dummyMediaId = mongoose.Types.ObjectId();

/**
 * A helper function to build the Authorization header string
 */
function getBearer() {
  return 'Bearer ' + token;
}

describe('Articles', function() {
  before(function(done) {
    var User = require('./../../api/user/user.model');

    User.find({}).remove(function() {
      User.create({
        provider: 'local',
        name: 'Test User',
        email: 'test@test.com',
        password: 'test'
      }, function(err, user) {
        userId = user._id.toString();

        var dummyMedia = [{
          _id: dummyMediaId,
          createdBy: userId,
          uri: 'http://example.org',
          createdAt: Date.now(),
          modifiedAt: Date.now()
        }];

        // Connect to the db
        MongoClient.connect(config.mongo.uri, function(err, db) {
          if (err) {
            return console.dir(err);
          }

          // Get the documents collection
          var mediaCol = db.collection('media');

          // Insert some documents
          mediaCol.insert(dummyMedia, done);
        });
      });
    });
  });

  after(function(done) {
    MongoClient.connect(config.mongo.uri, function(err, db) {
      if (err) {
        return console.dir(err);
      }

      var articleCol = db.collection('article'),
        mediaCol = db.collection('media');

      articleCol.remove(function(err, result) {
        mediaCol.remove(done);
      });
    });
  });

  describe('Login', function() {

    it('should receive a JSON Web token', function(done) {
      request(app)
        .post('/auth/local')
        .set('Content-Type', 'application/json')
        .send({
          'email': 'test@test.com',
          'password': 'test'
        })
        .expect('Content-Type', /json/)
        .expect(function(res) {
          token = res.body.token;
        })
        .expect(200, done);
    });
  });

  describe('GET /api/articles', function() {
    it('should return a list of articles', function(done) {
      request(app)
        .get('/api/articles')
        .set('Authorization', getBearer())
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function validateSchema(res) {
          var body = res.body;

          expect(body).to.have.key('page');
          expect(body).to.have.key('total');
          expect(body).to.have.key('num_pages');
          expect(body).to.have.key('result');

          expect(body.result).to.be.an('array');
        })
        .end(done);
    });

    it('should be able to handle page query', function(done) {
      request(app)
        .get('/api/articles?page=2')
        .set('Authorization', getBearer())
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function validateSchema(res) {
          var body = res.body;

          expect(body).to.have.key('page');
          expect(body).to.have.key('num_pages');
          expect(body).to.have.key('total');
          expect(body).to.have.key('result');

          expect(body.result).to.be.an('array');

          expect(body.page).to.be.a('number');
          expect(body.page).to.be(2);

          // default maximum page_size is 5
          expect(body.result.length <= 5).to.be.ok();
        })
        .end(done);
    });
  });

  describe('POST /api/articles', function() {
    it('should return the added articles', function(done) {
      request(app)
        .post('/api/articles')
        .set('Authorization', getBearer())
        .send({
          'media': [
            dummyMediaId
          ],
          'title': 'WISI CONSEQUAT SIT ZZRIL.',
          'body': 'Ut vulputate te dolor ipsum nonummy, dolore enim accumsan veniam duis, nibh veniam at nulla. Adipiscing, dolore dolor lobortis et qui, consequat ea tation iusto qui, tation velit minim. Delenit elit, feugait nibh illum diam vulputate, feugiat erat et velit veniam, tation ea. Consequat magna et, iriure delenit zzril vel ea, eum amet ut autem consequat, tincidunt. Aliquam adipiscing vero dolore, magna ut vel et veniam, iriure odio ullamcorper erat vulputate, facilisi dolore hendrerit in accumsan, accumsan illum iriure quis nibh, nisl vulputate nostrud enim. Commodo, lorem luptatum erat ut elit, blandit dolor eu adipiscing ipsum, dolor.',
          'tags': 'FEUGAIT, VEL, NULLA'
        })
        .expect('Content-Type', /json/)
        .expect(201)
        .expect(function validateSchema(res) {
          var body = res.body;

          toBeDelete = res.body._id;

          expect(body).to.be.an('object');
          expect(body).to.have.key('_id');
          expect(body).to.have.key('__v');
          expect(body).to.have.key('title');
          expect(body).to.have.key('body');
          expect(body).to.have.key('createdBy');
          expect(body).to.have.key('tags');
          expect(body).to.have.key('createdAt');
          expect(body).to.have.key('modifiedAt');
          expect(body).to.have.key('media');
        })
        .expect(function validateCreatedBySchema(res) {
          var createdBy = res.body.createdBy;

          expect(createdBy).to.have.key('_id');
          expect(createdBy).to.have.key('name');
          expect(createdBy).to.have.key('email');
          expect(createdBy).to.have.key('role');
        })
        .expect(function validateMediaSchema(res) {
          var media = res.body.media;

          for (var i = 0; i < media.length; i++) {
            expect(media[i]).to.have.key('_id');
            expect(media[i]).to.have.key('createdBy');
            expect(media[i]).to.have.key('uri');
            expect(media[i]).to.have.key('createdAt');
            expect(media[i]).to.have.key('modifiedAt');
          }
        })
        .end(done);
    });
  });

  describe('PUT /api/articles/:id', function() {
    it('should return the updated articles', function(done) {
      request(app)
        .put('/api/articles/' + toBeDelete)
        .set('Authorization', getBearer())
        .send({
          'title': 'WISI CONSEQUAT SIT ZZRIL.',
          'body': 'Ut vulputate te dolor ipsum nonummy, dolore enim accumsan veniam duis, nibh veniam at nulla. Adipiscing, dolore dolor lobortis et qui, consequat ea tation iusto qui, tation velit minim. Delenit elit, feugait nibh illum diam vulputate, feugiat erat et velit veniam, tation ea. Consequat magna et, iriure delenit zzril vel ea, eum amet ut autem consequat, tincidunt. Aliquam adipiscing vero dolore, magna ut vel et veniam, iriure odio ullamcorper erat vulputate, facilisi dolore hendrerit in accumsan, accumsan illum iriure quis nibh, nisl vulputate nostrud enim. Commodo, lorem luptatum erat ut elit, blandit dolor eu adipiscing ipsum, dolor.',
          'tags': 'FEUGAIT, VEL, NULLA',
          'media': [
            dummyMediaId
          ]
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function validateSchema(res) {
          var body = res.body;

          expect(body).to.be.an('object');

          // assert the properties
          expect(body).to.have.key('createdBy');
          expect(body).to.have.key('media');
          expect(body).to.have.key('title');
          expect(body).to.have.key('tags');
          expect(body).to.have.key('body');
          expect(body).to.have.key('_id');
          expect(body).to.have.key('createdAt');
          expect(body).to.have.key('modifiedAt');
        })
        .expect(function validateCreatedBySchema(res) {
          var createdBy = res.body.createdBy;

          expect(createdBy).to.have.key('_id');
          expect(createdBy).to.have.key('name');
          expect(createdBy).to.have.key('email');
          expect(createdBy).to.have.key('role');
        })
        .expect(function validateMediaSchema(res) {
          var media = res.body.media;

          for (var i = 0; i < media.length; i++) {
            expect(media[i]).to.have.key('_id');
            expect(media[i]).to.have.key('createdBy');
            expect(media[i]).to.have.key('uri');
            expect(media[i]).to.have.key('createdAt');
            expect(media[i]).to.have.key('modifiedAt');
          }
        })
        .end(done);
    });
  });

  describe('GET /api/articles/:id', function() {
    it('should return single articles', function(done) {
      request(app)
        .get('/api/articles/' + toBeDelete)
        .set('Authorization', getBearer())
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function validateSchema(res) {
          var body = res.body;
          expect(body).to.have.key('url');
          expect(body).to.have.key('jsonrpc');
          expect(body).to.have.key('result');
          expect(body.result._id).to.be(toBeDelete);

          // assert the media item properties
          expect(body.result).to.have.key('media');

          expect(body.result).to.be.an('object');
        })
        .expect(function validateMediaSchema(res) {
          var media = res.body.result.media;

          for (var i = 0; i < media.length; i++) {
            expect(media[i]).to.have.key('_id');
            expect(media[i]).to.have.key('createdBy');
            expect(media[i]).to.have.key('uri');
            expect(media[i]).to.have.key('createdAt');
            expect(media[i]).to.have.key('modifiedAt');
          }
        })
        .end(done);
    });
  });

  describe('DELETE /api/articles/:id', function() {
    it('should delete single articles', function(done) {
      request(app)
        .del('/api/articles/' + toBeDelete)
        .set('Authorization', getBearer())
        .expect(204, done);
    });
  });

  describe('get non-exist articles document', function() {
    it('should return HTTP 404 Not Found', function(done) {
      request(app)
        .get('/api/articles/540cebdfd7503d420d54a531')
        .set('Authorization', getBearer())
        .expect('Content-Type', /json/)
        .expect(404, done);
    });
  });
});
