/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model'),
  Client = require('../api/client/client.model'),
  Product = require('../api/product/product.model'),
  Service = require('../api/service/service.model'),
  Catalog = require('../api/catalog/catalog.model'),
  mongoose = require('mongoose');

var userId1 = mongoose.Types.ObjectId();
var userId2 = mongoose.Types.ObjectId();
var userAdmin = mongoose.Types.ObjectId();

Client.find({}).remove(function() {
  Client.create({
    // for development purposes we set the clientId and clientSecret manually
    name: 'Test client',
    clientId: 'b9acdae5-d525-4b07-941a-53e980ff225b',
    clientSecret: '123',
    createdBy: userId1,
  }, function() {
    console.log('finished populating clients');
  });
});

User.find({}).remove(function() {
  var dummyUsers = [{
    _id: userId1,
    provider: 'local',
    name: 'Test User1',
    email: 'test1@test.com',
    password: 'test1',
    active: false
  }, {
    _id: userId2,
    provider: 'local',
    name: 'Test User2',
    email: 'test2@test.com',
    password: 'test2',
    active: false
  }, {
    _id: userAdmin,
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin',
    active: false
  }];

  User.create(dummyUsers, function() {
    console.log('finished populating users');
  });
});

Product.find({}).remove(function() {
  var dummyProducts = [{
    createdBy: userId1.toString(),
    title: 'Sample Product Title',
    body: 'Sample Product Body',
    price: 200,
    url: 'http://example.org',
    createdAt: Date.now(),
    modifiedAt: Date.now()
  }];

  Product.create(dummyProducts, function() {
    console.log('finished populating products');
  });
});

Service.find({}).remove(function() {
  var dummyServices = [{
    createdBy: userId1.toString(),
    title: 'Sample Service Title',
    body: 'Sample Service Body',
    url: 'http://example.org',
    createdAt: Date.now(),
    modifiedAt: Date.now()
  }];

  Service.create(dummyServices, function() {
    console.log('finished populating services');
  });
});

Catalog.find({}).remove(function() {
  var dummyCatalogs = [{
    createdBy: userId1.toString(),
    title: 'Sample Service Title',
    body: 'Lorem ipsum dolor sit amet, eos cu vide cetero vulputate, sed ne euismod invenire.',
    url: 'http://example.org',
    pdfUrl: 'http://example.org',
    createdAt: Date.now(),
    modifiedAt: Date.now()
  }];

  Catalog.create(dummyCatalogs, function() {
    console.log('finished populating catalogs');
  });
});
