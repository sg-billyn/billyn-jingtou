'use strict';

var _ = require('lodash');
var async = require('async');
var Catalog = require('./catalog.model');
var User = require('./../user/user.model');
var Media = require('./../media/media.model');

// Get list of pages
exports.index = function(req, res) {
  async.waterfall([
    function getCatalogs(callback) {
      Catalog.paginate({
        query: {
          createdBy: req.user._id
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

      User.populate(provider.docs, options, function(err, catalogs) {
        if (err) {
          callback(err);
        }

        provider.docs = catalogs;
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
  Catalog
    .findById(req.params.id)
    .populate('createdBy', '-hashedPassword -salt -provider -__v')
    .populate('media')
    .exec(function(err, catalog) {
      if (err) {
        return handleError(res, err);
      }
      if (!catalog) {
        return res.send(404);
      }

      return res.json(200, catalog);
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
      function createCatalog(callback) {
        Catalog.create(data, function(err, catalog) {
          if (err) {
            callback(err, null);
          }

          callback(null, catalog);
        });
      },
      function populateUser(catalog, callback) {
        var options = {
          path: 'createdBy',
          model: 'User',
          select: '-hashedPassword -salt -provider -__v'
        };

        User.populate(catalog, options, function(err, result) {
          if (err) {
            callback(err);
          }

          callback(null, result);
        });
      },
      function populateMedia(catalog, callback) {
        var options = {
          path: 'media',
          model: 'Media'
        };

        Media.populate(catalog, options, function(err, result) {
          if (err) {
            callback(err);
          }

          callback(null, result);
        });
      }
    ], function(err, catalog) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(201, catalog);
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
      function getCatalog(callback) {
        Catalog.findOneAndUpdate({
          _id: req.params.id
        }, data, function(err, catalog) {
          if (err) {
            callback(err);
          }

          callback(null, catalog);
        });
      },
      function populateUser(catalog, callback) {
        var options = {
          path: 'createdBy',
          model: 'User',
          select: '-hashedPassword -salt -provider -__v'
        };

        User.populate(catalog, options, function(err, result) {
          if (err) {
            callback(err);
          }

          callback(null, result);
        });
      },
      function populateMedia(catalog, callback) {
        var options = {
          path: 'media',
          model: 'Media'
        };

        Media.populate(catalog, options, function(err, result) {
          if (err) {
            callback(err);
          }

          callback(null, result);
        });
      }
    ], function(err, catalog) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(200, catalog);
    });
  }
};

// Deletes a document from the DB.
exports.destroy = function(req, res) {
  Catalog.findById(req.params.id, function(err, catalog) {
    if (err) {
      return handleError(res, err);
    }
    if (!catalog) {
      return res.send(404);
    }
    catalog.remove(function(err) {
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
