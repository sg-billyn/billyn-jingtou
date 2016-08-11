'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/local-business-dev'
  },
  // AWS S3 storage configurations
  s3: {
    bucket: 'skounis-dev',
    uploadDir: 'local-business/',
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY
  },

  seedDB: true,

  baseUrl: 'http://localhost:9000'
};
