'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schemaOptions = {
  collection: 'account'
};

var AccountSchema = new Schema({
  createdBy: {
    type: String,
    ref: 'User'
  },
  business: {
    name:         { type: String, default: '' },
    description:  { type: String, default: '' },
    hours:        {
      zone :      { type: Number, number: 0 }, //GMT +x
      days :[{
        day :     { type: Number, number: 0 },
        openAt :  { type: Number, number: 1417248005669 },
        closeAt : { type: Number, number: 1417284005677 }
      }]
      },
    website:      { type: String, default: '' },
    email:        { type: String, default: '' },
    address:      { type: String, default: '' },
    city: { type: String, default: '' },
    zipcode:      { type: String, default: '' },
    latlong:      { type: String, default: '' },
    zoom:         { type: String, default: '' },
    social:{
      facebookPage: { type: String, default: '' }
    }
  },
  contact: {
    name:           { type: String, default: '' },
    phone:          { type: String, default: '' },
    email:          { type: String, default: '' }
  },
  // list of media associated with this document
  media: [{
    type: String,
    ref: 'Media'
  }],
  // we use this field when the first time news created
  createdAt: Number,
  // we use this field when the news is updated
  modifiedAt: Number
});

module.exports = mongoose.model('Account', AccountSchema);
