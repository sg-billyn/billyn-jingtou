'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');
var User = require('../../api/user/user.model');
var rand = require('random-key');
var config = require('../../config/environment');
var email = require('../../components/email');

var router = express.Router();

router.post('/', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    var error = err || info;
    if (error) return res.json(401, error);
    if (!user) return res.json(404, {
      message: 'Something went wrong, please try again.'
    });

    var token = auth.signToken(user._id, user.role);
    res.json({
      token: token
    });
  })(req, res, next)
});

router.post('/forgot', function(req, res) {
  // finding user with provided email
  User.findOne({email: req.body.email}, function(err, user) {
    if(err) return res.json(500, err);
    if(!user) return res.json(404, {message: 'Email provided could not be found.'});

    // generate reset token and expiration
    user.resetPasswordToken = rand.generate();
    user.resetPasswordExpiration = Date.now() + 3600000; // 1 hour
    user.save(function(err) {
      if(err) return res.json(500, err);

      // send email to user
      var from = 'passwordreset@' + config.emailDomain;
      var to = user.email;
      var subject = 'Password Reset - ' + config.appName;
      var resetUrl = config.baseUrl + '/reset/' + user.resetPasswordToken;
      var body = 'Please follow this link to reset your password: <a href="' + resetUrl + '">' + resetUrl + '</a>';
      email.sendEmail(from, to, subject, body);

      return res.send(200);
    });
  });
});

router.post('/reset', function(req, res) {
  // finding user by token
  User.findOne({resetPasswordToken: req.body.token}, function(err, user) {
    if(err) return res.json(500, err);
    if(!user) return res.json(404, {message: 'Reset password token could not be found.'});

    // check expiration
    if(user.resetPasswordExpiration < Date.now())
      return res.json(403, {message: 'Reset password token has expired.'});

    // encrypt the new password
    user.hashedPassword = user.encryptPassword(req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiration = undefined;

    // save the newly encrypted password
    user.save(function(err) {
      if(err) return res.json(500, err);
      return res.send(200);
    });
  });
});

module.exports = router;
