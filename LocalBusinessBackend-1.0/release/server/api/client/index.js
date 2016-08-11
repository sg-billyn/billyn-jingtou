'use strict';

var express = require('express'),
  controller = require('./client.controller'),
  auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/',             auth.isAuthenticated(), controller.index);
router.post('/',            auth.isAuthenticated(), controller.create);
router.post('/keys',        auth.isAuthenticated(), controller.generateKeys);
router.post('/:id',         auth.isAuthenticated(), controller.update);
router.get('/:id',          auth.isAuthenticated(), controller.show);
router.put('/:id',          auth.isAuthenticated(), controller.update);
router.delete('/:id',       auth.isAuthenticated(), controller.destroy);

module.exports = router;
