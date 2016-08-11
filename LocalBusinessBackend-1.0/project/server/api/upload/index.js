'use strict';

var express = require('express'),
  controller = require('./upload.controller'),
  multipart = require('connect-multiparty'),
  auth = require('../../auth/auth.service'),
  config = require('./../../config/environment');

var router = express.Router(),
  multipartMiddleware = multipart({
    // will be placed under the /work directory
    uploadDir: config.uploadDir + '/work'
  });

router.post('/',      auth.isAuthenticated(), multipartMiddleware, controller.create);
router.get('/:id',                                                 controller.show);
router.delete('/:id',                                              controller.destroy);

module.exports = router;
