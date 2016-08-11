'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto');

var ClientSchema = new Schema({
  createdBy: {
    type: String,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  // client identifier in UUID format
  clientId: String,
  // client secret
  clientSecret: String,
  // when the first time document is created
  createdAt: {
    type: Number,
    default: Date.now()
  },
  // when the last time document is modified
  modifiedAt: {
    type: Number,
    default: Date.now()
  }
});

/**
 * Virtuals
 */

// Validate empty client secret
ClientSchema
  .path('clientSecret')
  .validate(function(clientSecret) {
    return clientSecret.length;
  }, 'client secret cannot be blank');

/**
 * Methods
 */
ClientSchema.methods = {
  /**
   * Authenticate - check if the clientSecret are the same
   *
   * @param {String} plainText
   * @return {Boolean} true if the client secret is exist in our database
   * @api public
   */
  authenticate: function(plainText) {
    return plainText === this.clientSecret;
  }
};

module.exports = mongoose.model('Client', ClientSchema);
