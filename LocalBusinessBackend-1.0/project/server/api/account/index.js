'use strict';

var express = require('express'),
    controller = require('./account.controller'),
    auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/public',                                   controller.public.index);

router.get('/',                 auth.isAuthenticated(), controller.index);
router.get('/:id',              auth.isAuthenticated(), controller.show);
router.get('/search/:user_id',  auth.isAuthenticated(), controller.find);
router.post('/',                                        controller.create);
router.put('/:id',                                      controller.update);
router.patch('/:id',                                    controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;
