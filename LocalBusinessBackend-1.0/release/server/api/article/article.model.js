'use strict';

var mongoose = require('mongoose'),
  mUtilities = require('mongoose-utilities'),
  Schema = mongoose.Schema;

/**
 * Atricles Schema
 */
var ArticleSchema = new Schema({
  // reference the user account of the creator
  createdBy: {
    type: String,
    ref: 'User'
  },
  title: String,
  body: String,
  tags: {
    type: String,
    lowercase: true
  },
  // list of media associated with this document
  media: [{
    type: String,
    ref: 'Media'
  }],
  // we use this field when the first time record created
  createdAt: Number,
  // we use this field when the record is updated
  modifiedAt: Number
});

ArticleSchema.plugin(mUtilities.pagination);

module.exports = mongoose.model('Article', ArticleSchema);
