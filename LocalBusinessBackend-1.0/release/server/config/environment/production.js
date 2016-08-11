'use strict';

// Production specific configuration
// =================================
var serverIP = process.env.OPENSHIFT_NODEJS_IP ||
  process.env.IP ||
  undefined;

var serverPort = process.env.OPENSHIFT_NODEJS_PORT ||
  process.env.PORT ||
  8080;

var mongoOptions = {
  uri: process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME ||
    'mongodb://localhost/local-business'
};

var s3Config = {
  bucket: process.env.LB_AWS_BUCKET,
  uploadDir: process.env.LB_AWS_UPLOAD_DIR,
  accessKey: process.env.AWS_ACCESS_KEY,
  secretKey: process.env.AWS_SECRET_KEY
};

var baseUrl = 'http://' + serverIP + ':' + serverPort;

module.exports = {
  // Server IP
  ip: serverIP,
  // Server port
  port: serverPort,
  // MongoDB connection options
  mongo: mongoOptions,
  // AWS S3 storage configurations
  s3: s3Config,
  seedDB: false,
  baseUrl: baseUrl
};
