'use strict';

var app = require('../../app'),
  request = require('supertest'),
  request = require('supertest'),
  expect = require('expect.js'),
  MongoClient = require('mongodb').MongoClient,
  config = require('./../../config/environment');

var toBeDelete,
  token;

/**
 * A helper function to build the Authorization header string
 */
function getBearer() {
  return 'Bearer ' + token;
}

describe('Test login', function() {
  before(function(done) {
    var User = require('./../../api/user/user.model');

    User.find({}).remove(function() {
      User.create({
        provider: 'local',
        name: 'Test User',
        email: 'test@test.com',
        password: 'test'
      }, function() {
        done();
      });
    });
  });

  it('should receive a JSON Web token', function(done) {
    request(app)
      .post('/auth/local')
      .set('Content-Type', 'application/json')
      .send({
        "email": "test@test.com",
        "password": "test"
      })
      .expect('Content-Type', /json/)
      .expect(function(res) {
        token = res.body.token;
      })
      .expect(200, done);
  });
});

describe('/api/uploads', function() {
  after(function(done) {
    MongoClient.connect(config.mongo.uri, function(err, db) {
      if (!err) {
        db.collection('media', function(err, collection) {
          collection.remove({}, {
            w: 1
          }, function(err, result) {
            expect(err === null).to.be(true);
            done();
          });
        });
      }
    });
  });

  describe('POST /api/uploads', function() {
    it('should return the added media', function(done) {
      request(app)
        .post('/api/uploads')
        .set('Authorization', getBearer())
        .attach('file', 'server/api/upload/nodejs-01.png')
        .expect('Content-Type', /json/)
        .expect(function(res) {
          var body = res.body;

          expect(body).to.have.key('result');
          expect(body.result).to.have.key('file');

          toBeDelete = res.body.result.id;

          expect(body.result).to.be.an('object');
        })
        .expect(201, done);
    });
  });
});
