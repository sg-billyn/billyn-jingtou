'use strict';

var nodemailer = require('nodemailer');
var config = require('../../config/environment');

var sendEmail = function(from, to, subject, body) {
  var transporter = nodemailer.createTransport({
    service: 'Mailgun',
    auth: {
      user: config.mailgun.login,
      pass: config.mailgun.password
    }
  });
  var mailOpts = {
    from: from,
    to: to,
    cc: config.adminEmail,
    subject: subject,
    html: body
  };
  transporter.sendMail(mailOpts, function(err, res) {
    if(err) {
      console.log('email error');
      console.log(err);
    } else {
      console.log('email success');
      console.log(res);
    }
  });
};

module.exports = {
  sendEmail: sendEmail
};
