'use strict';

var express = require('express');
var controller = require('./space.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/user', auth.isAuthenticated(), controller.findUserSpaces);
//router.get('/user', controller.findUserSpaces);
router.get('/user/joinable', auth.isAuthenticated(), controller.findAllJoinableSpace);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

router.post('/userJoin', controller.userJoin);

module.exports = router;
