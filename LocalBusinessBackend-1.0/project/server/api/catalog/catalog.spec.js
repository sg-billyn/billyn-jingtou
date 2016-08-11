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
  dummyCatalogId = mongoose.Types.ObjectId(),
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

describe('/api/catalogs', function() {
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

        var dummyCatalogs = [{
          _id: dummyCatalogId,
          createdBy: user._id.toString(),
          title: 'Catalog title',
          media: [
            dummyMediaId.toString()
          ],
          body: 'Catalog body',
          url: 'http://example.org/url',
          pdfUrl: 'http://example.org/pdf',
          createdAt: Date.now(),
          modifiedAt: Date.now()
        }];

        async.series([
          function(cb) {
            insertDocs({
              collectionName: 'catalogs',
              documents: dummyCatalogs
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
        removeDocs('catalogs', cb);
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

  describe('GET /api/catalogs', function() {

    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/catalogs')
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
        .expect(function assertTheCatalogSchema(res) {
          var body = res.body.result[0];

          body.should.have.property('_id');
          body.should.have.property('title');
          body.should.have.property('body');
          body.should.have.property('media');
          body.should.have.property('createdBy');
          body.should.have.property('createdAt');
          body.should.have.property('modifiedAt');
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

  describe('GET /api/catalogs/:id', function() {

    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/catalogs/' + dummyCatalogId)
        .set('Authorization', getBearer())
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          var body = res.body;

          // assert the catalog properties
          body.should.have.property('_id');
          body.should.have.property('title');
          body.should.have.property('body');
          body.should.have.property('media');
          body.should.have.property('url');
          body.should.have.property('pdfUrl');
          body.should.have.property('createdBy');
          body.should.have.property('createdAt');
          body.should.have.property('modifiedAt');

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

  describe('POST /api/catalogs', function() {
    it('should respond with created content', function(done) {

      request(app)
        .post('/api/catalogs')
        .send({
          title: 'New catalog',
          media: [
            dummyMediaId.toString()
          ],
          body: 'New catalog body',
          url: 'http://example.org/url',
          pdfUrl: 'http://example.org/pdf'
        })
        .set('Authorization', getBearer())
        .expect(201)
        .expect('Content-Type', /json/)
        .expect(function assertTheResultSchema(res) {
          var body = res.body;

          body.should.have.property('_id');
          body.should.have.property('title');
          body.should.have.property('body');
          body.should.have.property('media');
          body.should.have.property('url');
          body.should.have.property('pdfUrl');
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

  describe('POST /api/catalogs/:id', function() {
    var existingCatalog = {};

    before(function getTheCatalogDetails(done) {
      request(app)
        .get('/api/catalogs/' + dummyCatalogId.toString())
        .set('Authorization', getBearer())
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          existingCatalog = res.body;

          done();
        });
    });

    it('should respond with updated content', function(done) {
      request(app)
        .post('/api/catalogs/' + dummyCatalogId.toString())
        .send(existingCatalog)
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
          body.should.have.property('url');
          body.should.have.property('pdfUrl');
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

  describe('PUT /api/catalogs/:id', function() {
    var existingCatalog = {};

    before(function getTheCatalogDetails(done) {
      request(app)
        .get('/api/catalogs/' + dummyCatalogId.toString())
        .set('Authorization', getBearer())
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            console.error(err);
            return done(err);
          }

          existingCatalog = res.body;

          done();
        });
    });

    it('should respond with updated content', function(done) {
      request(app)
        .post('/api/catalogs/' + dummyCatalogId.toString())
        .send(existingCatalog)
        .set('Authorization', getBearer())
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function assertTheResultSchema(res) {
          var body = res.body;

          // assert the media item properties
          body.should.have.property('_id');
          body.should.have.property('title');
          body.should.have.property('body');
          body.should.have.property('media');
          body.should.have.property('url');
          body.should.have.property('pdfUrl');
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
