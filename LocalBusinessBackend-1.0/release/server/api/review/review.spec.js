'use strict';

var should = require('should'),
    app = require('../../app'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    User = require('./../../api/user/user.model'),
    config = require('./../../config/environment'),
    MongoClient = require('mongodb').MongoClient;


var token = '',
    dummyReviewId = mongoose.Types.ObjectId(),
    dummyMediaId = mongoose.Types.ObjectId(),
    userId = '';

/**
* A helper function to build the Authorization header string
*/
function getBearer() {
  return 'Bearer ' + token;
}

describe('/api/reviews', function() {

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

        var dummyReviews = [{
          _id: dummyReviewId,
          createdBy: user._id.toString(),
          title: 'Review title',
          teaser: 'Review teaser',
          media: [
            dummyMediaId.toString()
          ],
          body: 'Review body',
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
          var reviewCol = db.collection('reviews'),
          mediaCol = db.collection('media');

          // Insert some documents
          mediaCol.insert(dummyMedia, function(err, result) {
            reviewCol.insert(dummyReviews, function(err, result) {
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

      var pagesCol = db.collection('reviews'),
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

  describe('GET /api/reviews', function() {

    it('should respond with JSON array', function(done) {
      request(app)
      .get('/api/reviews')
      .set('Authorization', getBearer())
      .expect(200)
      // .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.result.should.be.instanceof(Array);
        done();
      });
    });

  });

});
