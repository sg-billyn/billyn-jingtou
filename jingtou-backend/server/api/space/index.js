'use strict';

var express = require('express');
var controller = require('./space.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/user', auth.isAuthenticated(), controller.findUserSpaces);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

router.get('/:id/userJoin', controller.userJoin);

module.exports = router;
