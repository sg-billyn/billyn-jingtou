/**
 * Populate DB with admin user only under the following circumstances
 *
 * 1. There is no Users colection available
 * 2. There are no documents (users) in the Users collection
 *
 * Normally this will happen only the very first time the application
 * will be deployed in the production environment
 */

'use strict';

var User = require('../api/user/user.model');
var mongoose = require('mongoose');

User.count(function(err, count) {
  if(!count) {

    var userAdmin = mongoose.Types.ObjectId();
    var userTest1 = mongoose.Types.ObjectId();

    var initialUsers = [{
        _id: userAdmin,
        provider: 'local',
        role: 'admin',
        name: 'Admin',
        email: 'admin@admin.com',
        password: 'admin'
      },{
        _id: userTest1,
        provider: 'local',
        name: 'Test User1',
        email: 'test1@test.com',
        password: 'test1'
      }
      // Add more users here
      ];

    User.create(initialUsers, function() {
      console.log('finished populating admin user');
    });
  }
});
