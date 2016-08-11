var express = require('express'),
  passport = require('passport'),
  auth = require('../auth.service');

var router = express.Router();

router.post('/', function(req, res, next) {
  passport.authenticate('client-strategy', function(err, client, info) {
    var error = err || info;
    if (error) {
      return res.json(401, error);
    }

    if (!client) {
      return res.json(404, {
        message: 'Something went wrong, please try again.'
      });
    }

    var token = auth.signToken(client._id);
    res.json({
      token: token
    });
  })(req, res, next);
});

module.exports = router;
