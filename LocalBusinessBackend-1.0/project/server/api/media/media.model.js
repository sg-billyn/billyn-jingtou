'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Media Schema
 */
var MediaSchema = new Schema({
  createdBy: {
    type: String,
    ref: 'User'
  }, // path/url where picture stored
  uri: String,
  // we use this field when the first time news created
  createdAt: Number,
  // we use this field when the news is updated
  modifiedAt: Number
});

module.exports = mongoose.model('Media', MediaSchema);