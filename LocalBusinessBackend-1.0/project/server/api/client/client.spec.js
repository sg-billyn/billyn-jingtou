'use strict';

var should = require('should'),
  rand = require('random-key'),
  uuid = require('node-uuid'),
  request = require('supertest'),
  mongoose = require('mongoose'),
  MongoClient = require('mongodb').MongoClient,
  app = require('../../app'),
  config = require('./../../config/environment');

var token = '',
  userId = mongoose.Types.ObjectId(),
  clientId = mongoose.Types.ObjectId();

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

describe('/api/clients', function() {
  before(function(done) {
    var dummyUsers = [{
      _id: userId,
      provider: 'local',
      name: 'Test User1',
      email: 'test1@test.com',
      hashedPassword: 'IfwIzXmNpctDFHMuGTb+V2fbmgRl24Y2eXEkqBZc5EMJ7p/fCF2FKLOVG0eDys17z6vegQbHPM0G2acDoGiJOg==',
      salt: 'BHVro6CQVNubA/xZ17Gt7Q==',
      expiration: 1430390165420,
      role: 'user',
      __v: 0
    }];

    insertDocs({
      collectionName: 'users',
      documents: dummyUsers
    }, done);
  });

  after(function(done) {
    removeDocs('users', done);
  });

  describe('Login', function() {
    it('should receive a JSON Web token', function(done) {
      request(app)
        .post('/auth/local')
        .set('Content-Type', 'application/json')
        .send({
          'email': 'test1@test.com',
          'password': 'test1'
        })
        .expect('Content-Type', /json/)
        .expect(function(res) {
          token = res.body.token;
        })
        .expect(200, done);
    });
  });

  describe('GET /api/clients', function() {
    before(function(done) {
      var dummyClients = [{
        _id: clientId,
        name: 'Test client',
        clientId: 'b9acdae5-d525-4b07-941a-53e980ff225b',
        clientSecret: '123',
        salt: 'f2Mu2Vh8jxJsDAxm/2rzlQ==',
        createdBy: userId.toString(),
        modifiedAt: 1430390456922,
        createdAt: 1430390456922,
        __v: 0
      }];

      insertDocs({
        collectionName: 'clients',
        documents: dummyClients
      }, done);
    });

    after(function(done) {
      removeDocs('clients', done);
    });

    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/clients')
        .set('Authorization', getBearer())
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          var body = res.body;

          body.should.have.property('result');
          body.result.should.be.instanceof(Array);

          // assert the document structure
          var client = body.result[0];
          client.should.have.property('_id');
          client.should.have.property('name');
          client.should.have.property('clientId');
          client.should.have.property('createdBy');
          client.should.have.property('modifiedAt');
          client.should.have.property('createdAt');
          client.should.have.property('__v');

          done();
        });
    });
  });

  describe('GET /api/clients/:id', function() {
    before(function(done) {
      var dummyClients = [{
        _id: clientId,
        name: 'Test client',
        clientId: 'b9acdae5-d525-4b07-941a-53e980ff225b',
        clientSecret: '123',
        salt: 'f2Mu2Vh8jxJsDAxm/2rzlQ==',
        createdBy: userId.toString(),
        modifiedAt: 1430390456922,
        createdAt: 1430390456922,
        __v: 0
      }];

      insertDocs({
        collectionName: 'clients',
        documents: dummyClients
      }, done);
    });

    after(function(done) {
      removeDocs('clients', done);
    });

    it('should return client details', function(done) {
      request(app)
        .get('/api/clients/' + clientId.toString())
        .set('Authorization', getBearer())
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          var body = res.body;

          // assert the document structure
          body.should.have.property('_id');
          body.should.have.property('name');
          body.should.have.property('clientId');
          body.should.have.property('createdBy');
          body.should.have.property('modifiedAt');
          body.should.have.property('createdAt');
          body.should.have.property('__v');

          done();
        });
    });
  });

  describe('POST /api/clients/keys', function() {
    it('should return the new client keys', function(done) {
      request(app)
        .post('/api/clients/keys')
        .set('Authorization', getBearer())
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          var body = res.body;

          body.should.have.property('result');

          // assert the document structure
          var client = body.result;
          client.should.have.property('clientSecret');
          client.should.have.property('clientId');

          done();
        });
    });
  });

  describe('POST /api/clients', function() {

    describe('send a valid request body', function(done) {
      var body = {};

      before(function() {
        body.name = 'oDesk';
        body.clientId = uuid.v4();
        body.clientSecret = rand.generate();
      });

      after(function(done) {
        removeDocs('clients', done);
      });

      it('should respond with 201', function(done) {
        request(app)
          .post('/api/clients')
          .set('Authorization', getBearer())
          .send(body)
          .expect(201)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err);

            var body = res.body;

            // assert the document structure
            body.should.have.property('_id');
            body.should.have.property('name');
            body.should.have.property('clientId');
            body.should.have.property('createdBy');
            body.should.have.property('modifiedAt');
            body.should.have.property('createdAt');
            body.should.have.property('__v');

            done();
          });
      });
    });

    describe.skip('send an invalid request body', function() {
      it('should respond with 400, if request body is empty', function(done) {
        request(app)
          .post('/api/clients')
          .set('Authorization', getBearer())
          .expect(400)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err);

            res.body.should.have.length(3);
            done();
          });
      });

      it('should respond with 400, if name is missing', function(done) {
        request(app)
          .post('/api/clients')
          .set('Authorization', getBearer())
          .send({
            clientId: uuid.v4(),
            clientSecret: rand.generate()
          })
          .expect(400)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err);

            res.body.should.have.length(1);
            done();
          });
      });

      it('should respond with 400, if clientId is missing', function(done) {
        request(app)
          .post('/api/clients')
          .set('Authorization', getBearer())
          .send({
            name: 'oDesk',
            clientSecret: rand.generate()
          })
          .expect(400)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err);

            res.body.should.have.length(1);
            done();
          });
      });

      it('should respond with 400, if clientSecret is missing', function(done) {
        request(app)
          .post('/api/clients')
          .set('Authorization', getBearer())
          .send({
            name: 'oDesk',
            clientId: uuid.v4()
          })
          .expect(400)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err);

            res.body.should.have.length(1);
            done();
          });
      });
    });
  });

  describe('PUT /api/clients', function() {
    before(function(done) {
      var dummyClients = [{
        _id: clientId,
        name: 'Test client',
        clientId: 'b9acdae5-d525-4b07-941a-53e980ff225b',
        clientSecret: '123',
        salt: 'f2Mu2Vh8jxJsDAxm/2rzlQ==',
        createdBy: userId.toString(),
        modifiedAt: 1430390456922,
        createdAt: 1430390456922,
        __v: 0
      }];

      insertDocs({
        collectionName: 'clients',
        documents: dummyClients
      }, done);
    });

    after(function(done) {
      removeDocs('clients', done);
    });

    describe('send a valid request body', function(done) {
      var body = {};

      before(function() {
        body.name = 'oDesk';
        body.clientId = uuid.v4();
        body.clientSecret = rand.generate();
      });

      after(function(done) {
        removeDocs('clients', done);
      });

      it('should respond with 200', function(done) {
        request(app)
          .put('/api/clients/' + clientId)
          .set('Authorization', getBearer())
          .send(body)
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err);

            var body = res.body;

            // assert the document structure
            body.should.have.property('_id');
            body.should.have.property('name');
            body.should.have.property('clientId');
            body.should.have.property('createdBy');
            body.should.have.property('modifiedAt');
            body.should.have.property('createdAt');
            body.should.have.property('__v');

            done();
          });
      });
    });

    describe.skip('send an invalid request body', function() {
      it('should respond with 400, if request body is empty', function(done) {
        request(app)
          .put('/api/clients/' + clientId)
          .set('Authorization', getBearer())
          .expect(400)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err);

            res.body.should.have.length(1);
            done();
          });
      });

      it('should respond with 400, if name is missing', function(done) {
        request(app)
          .put('/api/clients/' + clientId)
          .set('Authorization', getBearer())
          .send({
            clientId: uuid.v4(),
            clientSecret: rand.generate()
          })
          .expect(400)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err);

            res.body.should.have.length(1);
            done();
          });
      });
    });
  });

  describe('DELETE /api/clients/:id', function() {
    before(function(done) {
      var dummyClients = [{
        _id: clientId,
        name: 'Test client',
        clientId: 'b9acdae5-d525-4b07-941a-53e980ff225b',
        clientSecret: '123',
        salt: 'f2Mu2Vh8jxJsDAxm/2rzlQ==',
        createdBy: userId.toString(),
        modifiedAt: 1430390456922,
        createdAt: 1430390456922,
        __v: 0
      }];

      insertDocs({
        collectionName: 'clients',
        documents: dummyClients
      }, done);
    });

    after(function(done) {
      removeDocs('clients', done);
    });

    it('should respond with 204, if deletion is successful', function(done) {
      request(app)
        .del('/api/clients/' + clientId.toString())
        .set('Authorization', getBearer())
        .expect(204, done);
    });

    it.skip('should respond with 400, if identifier is invalid', function(done) {
      request(app)
        .del('/api/clients/123')
        .set('Authorization', getBearer())
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);

          res.body.should.have.length(1);
          done();
        });
    });

    it('should respond with 404, if client is not exist', function(done) {
      request(app)
        .del('/api/clients/' + mongoose.Types.ObjectId().toString())
        .set('Authorization', getBearer())
        .expect(404, done);
    });
  });
});
