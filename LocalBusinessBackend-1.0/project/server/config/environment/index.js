'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Should we populate the DB with sample data?
  seedDB: false,

    // Email configs
  emailDomain: process.env.MAILGUN_EMAIL_DOMAIN || 'mail.domain.com',
  mailgun: {
    login: process.env.MAILGUN_LOGIN || 'postmaster@rs10009.mailgun.org',
    password: process.env.MAILGUN_PASSWORD || '0u1fw-0qr317'
  },

  // App info
  baseUrl: process.env.LB_BASE_URL || 'http://localhost:9000',
  appName: 'Local Business Backend',
  adminEmail: process.env.LB_ADMIN_EMAIL,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'news-secret'
  },

  // List of user roles
  // admin has the highest role
  // guest has the lowest role
  userRoles: ['guest', 'user', 'admin'],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  // upload directory relative to the application directory
  uploadDir: 'uploads'
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});
