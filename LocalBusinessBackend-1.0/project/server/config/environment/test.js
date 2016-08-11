'use strict';

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/local-business-test'
  },
  // AWS S3 storage configurations
  s3: {
    bucket: 'skounis-dev',
    uploadDir: 'local-business/'
  }
};
