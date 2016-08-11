'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../config/environment');
var User = require('../api/user/user.model');
var Client = require('../api/client/client.model');

// Passport Configuration
require('./local/passport').setup(User, config);
require('./client/passport').setup(Client, config);

var router = express.Router();

// router to handle the user-level access
router.use('/local', require('./local'));
// router to handle the client-level access
router.use('/client', require('./client'));

module.exports = router;
