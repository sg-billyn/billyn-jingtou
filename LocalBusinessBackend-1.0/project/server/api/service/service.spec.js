'use strict';

var should = require('should'),
  async = require('async'),
  app = require('../../app'),
  request = require('supertest'),
  mongoose = require('mongoose'),
  User = require('./../../api/user/user.model'),
  config = require('./../../config/environment'),
  MongoClient = require('mongodb').MongoClient;

var token = '',
  dummyProductId = mongoose.Types.ObjectId(),
  dummyMediaId = mongoose.Types.ObjectId(),
  userId = '';

/**
 * A helper function to build the Authorization header string
 */
function getBearer() {
  return 'Bearer ' + token;
}

function insertDocs(data, cb) {
  // Connect to the db
  MongoClient.connect(config.mongo.uri, function(err, db) {
    if (err) {
      cb(err);
    }

    var collection = db.collection(data.collectionName);

    // Insert some documents
    collection.insert(data.documents, function(err, result) {
      if (err) {
        cb(err);
      }

      db.close();

      cb(null, result);
    });
  });
}

function removeDocs(collectionName, cb) {
  // Connect to the db
  MongoClient.connect(config.mongo.uri, function(err, db) {
    if (err) {
      cb(err);
    }

    var collection = db.collection(collectionName);

    collection.remove(function(err, result) {
      if (err) {
        cb(err);
      }

      cb(null, result);
    });
  });
}

describe('/api/services', function() {
  before(function(done) {
    User.find({}).remove(function() {
      User.create({
        provider: 'local',
        name: 'Test User',
        email: 'test@test.com',
        password: 'test'
      }, function(err, user) {
        userId = user._id.toString();

        // setup dummy media
        var dummyMedias = [{
          _id: dummyMediaId,
          createdBy: userId.toString(),
          uri: 'http://example.org',
          createdAt: Date.now(),
          modifiedAt: Date.now()
        }];

        var dummyServices = [{
          _id: dummyProductId,
          createdBy: user._id.toString(),
          title: 'Product title',
          media: [
            dummyMediaId.toString()
          ],
          body: 'Product body',
          url: 'http://example.org',
          createdAt: Date.now(),
          modifiedAt: Date.now()
        }];

        async.series([
          function(cb) {
            insertDocs({
              collectionName: 'services',
              documents: dummyServices
            }, cb)
          },
          function(cb) {
            insertDocs({
              collectionName: 'media',
              documents: dummyMedias
            }, cb)
          }
        ], done);
      });
    });
  });

  after(function(done) {
    async.series([function(cb) {
        removeDocs('services', cb);
      },
      function(cb) {
        removeDocs('media', cb);
      }
    ], done)
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

  describe('GET /api/services', function() {

    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/services')
        .set('Authorization', getBearer())
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function assertTheResultSchema(res) {
          var body = res.body;
          body.should.have.property('page');          
          body.should.have.property('total');
          body.should.have.property('num_pages');
          body.should.have.property('result');

          body.result.should.be.instanceof(Array);
        })
        .expect(function assertTheCreatedBySchema(res) {
          res.body.result[0].should.have.property('createdBy');

          var createdBy = res.body.result[0].createdBy;
          createdBy.should.have.property('_id');
          createdBy.should.have.property('name');
          createdBy.should.have.property('email');
          createdBy.should.have.property('role');
        })
        .expect(function assertTheMediaSchema(res) {
          res.body.result[0].should.have.property('media');

          var media = res.body.result[0].media[0];
          media.should.have.property('_id');
          media.should.have.property('createdAt');
          media.should.have.property('modifiedAt');
          media.should.have.property('uri');
        })
        .end(done);
    });
  });

  describe('GET /api/services/:id', function() {

    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/services/' + dummyProductId)
        .set('Authorization', getBearer())
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          var body = res.body;

          // assert the media item properties
          body.should.have.property('media');
          body.media[0].should.have.property('createdBy');
          body.media[0].should.have.property('uri');
          body.media[0].should.have.property('createdAt');
          body.media[0].should.have.property('modifiedAt');

          body.should.have.property('createdBy');
          // assert the createdBy properties
          body.createdBy.should.have.property('name');
          body.createdBy.should.have.property('email');
          body.createdBy.should.have.property('_id');
          body.createdBy.should.have.property('role');

          done();
        });
    });
  });

  describe('POST /api/services', function() {
    it('should respond with created content', function(done) {

      request(app)
        .post('/api/services')
        .send({
          title: 'New service',
          media: [
            dummyMediaId.toString()
          ],
          body: 'New service body'
        })
        .set('Authorization', getBearer())
        .expect(201)
        .expect('Content-Type', /json/)
        .expect(function assertTheResultSchema(res) {
          var body = res.body;

          // assert the media item properties
          body.should.have.property('_id');
          body.should.have.property('title');
          body.should.have.property('body');
          body.should.have.property('media');
          body.should.have.property('createdBy');
          body.should.have.property('createdAt');
          body.should.have.property('modifiedAt');
        })
        .expect(function assertTheCreatedBySchema(res) {
          var createdBy = res.body.createdBy;
          createdBy.should.have.property('_id');
          createdBy.should.have.property('name');
          createdBy.should.have.property('email');
          createdBy.should.have.property('role');
        })
        .expect(function assertTheMediaSchema(res) {
          var media = res.body.media[0];
          media.should.have.property('_id');
          media.should.have.property('createdAt');
          media.should.have.property('modifiedAt');
          media.should.have.property('uri');
        })
        .end(done);

    })
  });

  describe('POST /api/services/:id', function() {
    var existingProduct = {};

    before(function getTheProductDetails(done) {
      request(app)
        .get('/api/services/' + dummyProductId.toString())
        .set('Authorization', getBearer())
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          existingProduct = res.body;

          done();
        });
    });

    it('should respond with updated content', function(done) {
      request(app)
        .post('/api/services/' + dummyProductId.toString())
        .send(existingProduct)
        .set('Authorization', getBearer())
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function assertTheResultSchema(res) {
          var body = res.body;

          // assert the media item properties
          body.should.have.property('_id');
          body.should.have.property('title');
          body.should.have.property('body');
          body.should.have.property('media');
          body.should.have.property('createdBy');
          body.should.have.property('createdAt');
          body.should.have.property('modifiedAt');
        })
        .expect(function assertTheCreatedBySchema(res) {
          var createdBy = res.body.createdBy;
          createdBy.should.have.property('_id');
          createdBy.should.have.property('name');
          createdBy.should.have.property('email');
          createdBy.should.have.property('role');
        })
        .expect(function assertTheMediaSchema(res) {
          var media = res.body.media[0];
          media.should.have.property('_id');
          media.should.have.property('createdAt');
          media.should.have.property('modifiedAt');
          media.should.have.property('uri');
        })
        .end(done);
    });
  });

  describe('PUT /api/services/:id', function() {
    var existingProduct = {};

    before(function getTheProductDetails(done) {
      request(app)
        .get('/api/services/' + dummyProductId.toString())
        .set('Authorization', getBearer())
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          existingProduct = res.body;

          done();
        });
    });

    it('should respond with updated content', function(done) {
      request(app)
        .post('/api/services/' + dummyProductId.toString())
        .send(existingProduct)
        .set('Authorization', getBearer())
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function assertTheResultSchema(res) {
          var body = res.body;

          // assert the media item properties
          body.should.have.property('_id');
          body.should.have.property('title');
          body.should.have.property('body');
          body.should.have.property('media');
          body.should.have.property('createdBy');
          body.should.have.property('createdAt');
          body.should.have.property('modifiedAt');
        })
        .expect(function assertTheCreatedBySchema(res) {
          var createdBy = res.body.createdBy;
          createdBy.should.have.property('_id');
          createdBy.should.have.property('name');
          createdBy.should.have.property('email');
          createdBy.should.have.property('role');
        })
        .expect(function assertTheMediaSchema(res) {
          var media = res.body.media[0];
          media.should.have.property('_id');
          media.should.have.property('createdAt');
          media.should.have.property('modifiedAt');
          media.should.have.property('uri');
        })
        .end(done);
    });
  });
});
