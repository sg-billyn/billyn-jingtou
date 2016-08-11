'use strict';

var express = require('express'),
  auth = require('../../auth/auth.service'),
  controller = require('./media.controller');

var router = express.Router();

router.post('/',      auth.isAuthenticated(), controller.create);
router.get('/:id',    auth.isAuthenticated(), controller.show);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);
router.delete('/', auth.isAuthenticated(), controller.destroyList);

module.exports = router;
