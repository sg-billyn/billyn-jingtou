'use strict';

var express = require('express'),
  controller = require('./user.controller'),
  auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/:id/show', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
router.post('/:id', controller.update);

module.exports = router;
