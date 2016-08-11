'use strict';

var _ = require('lodash');
var async = require('async');
var Product = require('./product.model');
var User = require('./../user/user.model');
var Media = require('./../media/media.model');

// Get list of pages
exports.index = function(req, res) {
  async.waterfall([
    function getProducts(callback) {
      Product.paginate({
        query: {
          createdBy: req.user._id.toString()
        },
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 5,
        sort: {
          modifiedAt: -1
        }
      }, function(err, provider) {
        if (err) {
          return handleError(res, err);
        }
        callback(null, provider);
      });
    },
    function populateUser(provider, callback) {
      var options = {
        path: 'createdBy',
        model: 'User',
        select: '-hashedPassword -salt -provider -__v'
      };

      User.populate(provider.docs, options, function(err, products) {
        if (err) {
          callback(err);
        }

        provider.docs = products;
        callback(null, provider);
      });
    },
    function populateMedia(provider, callback) {
      var options = {
        path: 'media',
        model: 'Media'
      };

      Media.populate(provider.docs, options, function(err, medias) {
        if (err) {
          callback(err);
        }

        provider.docs = medias;
        callback(null, provider);
      });
    }
  ], function(err, provider) {
    if (err) {
      return handleError(res, err);
    }

    return res.json(200, {
      page: provider.page,
      total: provider.docs.length,
      num_pages: provider.pages,
      result: provider.docs
    });
  });
};

// Get a single document
exports.show = function(req, res) {
  Product
    .findById(req.params.id)
    .populate('createdBy', '-hashedPassword -salt -provider -__v')
    .populate('media')
    .exec(function(err, product) {
      if (err) {
        return handleError(res, err);
      }
      if (!product) {
        return res.send(404);
      }

      return res.json(200, product);
    });
};

// Creates a new document in the DB.
exports.create = function(req, res) {

  if (req.body) {
    var data = req.body;
    data.createdBy  = req.user._id;
    data.createdAt  = Date.now();
    data.modifiedAt = Date.now();

    async.waterfall([
      function createProduct(callback) {
        Product.create(data, function(err, product) {
          if (err) {
            callback(err, null);
          }

          callback(null, product);
        });
      },
      function populateUser(product, callback) {
        var options = {
          path: 'createdBy',
          model: 'User',
          select: '-hashedPassword -salt -provider -__v'
        };

        User.populate(product, options, function(err, populatedUser) {
          if (err) {
            callback(err);
          }

          callback(null, populatedUser);
        });
      },
      function populateMedia(product, callback) {
        var options = {
          path: 'media',
          model: 'Media'
        };

        Media.populate(product, options, function(err, populatedMedia) {
          if (err) {
            callback(err);
          }

          callback(null, populatedMedia);
        });
      }
    ], function(err, product) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(201, product);
    });
  }
};

// Updates an existing document in the DB.
exports.update = function(req, res) {
  if (req.body && req.params.id) {
    var data = req.body;
    data.modifiedAt = Date.now();
    delete data._id;
    delete data.createdBy;

    async.waterfall([
      function getProduct(callback) {
        Product.findOneAndUpdate({
          _id: req.params.id
        }, data, function(err, product) {
          if (err) {
            callback(err);
          }

          callback(null, product);
        });
      },
      function populateUser(product, callback) {
        var options = {
          path: 'createdBy',
          model: 'User',
          select: '-hashedPassword -salt -provider -__v'
        };

        User.populate(product, options, function(err, result) {
          if (err) {
            callback(err);
          }

          callback(null, result);
        });
      },
      function populateMedia(product, callback) {
        var options = {
          path: 'media',
          model: 'Media'
        };

        Media.populate(product, options, function(err, result) {
          if (err) {
            callback(err);
          }

          callback(null, result);
        });
      }
    ], function(err, product) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(200, product);
    });
  }
};

// Deletes a document from the DB.
exports.destroy = function(req, res) {
  Product.findById(req.params.id, function(err, product) {
    if (err) {
      return handleError(res, err);
    }
    if (!product) {
      return res.send(404);
    }
    product.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
