'use strict';

var should = require('should'),
  app = require('../../app'),
  request = require('supertest'),
  mongoose = require('mongoose'),
  User = require('./../../api/user/user.model'),
  config = require('./../../config/environment'),
  MongoClient = require('mongodb').MongoClient;

var token = '',
  dummyPageId = mongoose.Types.ObjectId(),
  dummyMediaId = mongoose.Types.ObjectId(),
  userId = '';

/**
 * A helper function to build the Authorization header string
 */
function getBearer() {
  return 'Bearer ' + token;
}

describe('/api/pages', function() {

  before(function(done) {
    User.find({}).remove(function() {
      User.create({
        provider: 'local',
        name: 'Test User',
        email: 'test@test.com',
        password: 'test'
      }, function(err, user) {
        // setup the dummy documents
        userId = user._id.toString();

        var dummyPages = [{
          _id: dummyPageId,
          createdBy: user._id.toString(),
          title: 'Page title',
          teaser: 'Page teaser',
          media: [
            dummyMediaId.toString()
          ],
          body: 'Page body',
          createdAt: Date.now(),
          modifiedAt: Date.now()
        }];

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
          var pagesCol = db.collection('pages'),
            mediaCol = db.collection('media');

          // Insert some documents
          mediaCol.insert(dummyMedia, function(err, result) {
            pagesCol.insert(dummyPages, function(err, result) {
              done();
            });
          });
        });
      });
    });
  });

  after(function(done) {
    MongoClient.connect(config.mongo.uri, function(err, db) {
      if (err) {
        return console.dir(err);
      }

      var pagesCol = db.collection('pages'),
        mediaCol = db.collection('media');

      pagesCol.remove(function(err, result) {
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

  describe('GET /api/pages', function() {

    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/pages')
        .set('Authorization', getBearer())
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          var body = res.body;

          body.should.have.property('page');
          body.should.have.property('total');
          body.should.have.property('num_pages');
          body.should.have.property('result');

          body.result.should.be.instanceof(Array);

          done();
        });
    });
  });

  describe('GET /api/pages/:id', function() {

    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/pages/' + dummyPageId)
        .set('Authorization', getBearer())
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          var body = res.body;

          body.should.have.property('result');

          // assert the media item properties
          body.result.should.have.property('media');
          body.result.media[0].should.have.property('createdBy');
          body.result.media[0].should.have.property('uri');
          body.result.media[0].should.have.property('createdAt');
          body.result.media[0].should.have.property('modifiedAt');

          body.result.should.have.property('createdBy');
          // assert the createdBy properties
          body.result.createdBy.should.have.property('name');
          body.result.createdBy.should.have.property('email');
          body.result.createdBy.should.have.property('_id');
          body.result.createdBy.should.have.property('role');

          done();
        });
    });
  });
});
