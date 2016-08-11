'use strict';

var _ = require('lodash');
var async = require('async');
var Gallery = require('./gallery.model');
var User = require('./../user/user.model');
var Media = require('./../media/media.model');

// Get list of pages
exports.index = function(req, res) {
  async.waterfall([
    function getgallerys(callback) {
      Gallery.paginate({
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

      User.populate(provider.docs, options, function(err, gallerys) {
        if (err) {
          callback(err);
        }

        provider.docs = gallerys;
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
  Gallery
    .findById(req.params.id)
    .populate('createdBy', '-hashedPassword -salt -provider -__v')
    .populate('media')
    .exec(function(err, gallery) {
      if (err) {
        return handleError(res, err);
      }
      if (!gallery) {
        return res.send(404);
      }

      return res.json(200, gallery);
    });
};

// Creates a new document in the DB.
exports.create = function(req, res) {

  if (req.body) {
    var data = {
      createdBy: req.user._id,
      title: req.body.title,
      media: req.body.media,
      body: req.body.body,
      createdAt: Date.now(),
      modifiedAt: Date.now()
    };

    async.waterfall([
      function creategallery(callback) {
        Gallery.create(data, function(err, gallery) {
          if (err) {
            callback(err, null);
          }

          callback(null, gallery);
        });
      },
      function populateUser(gallery, callback) {
        var options = {
          path: 'createdBy',
          model: 'User',
          select: '-hashedPassword -salt -provider -__v'
        };

        User.populate(gallery, options, function(err, gallery) {
          if (err) {
            callback(err);
          }

          callback(null, gallery);
        });
      },
      function populateMedia(gallery, callback) {
        var options = {
          path: 'media',
          model: 'Media'
        };

        Media.populate(gallery, options, function(err, gallery) {
          if (err) {
            callback(err);
          }

          callback(null, gallery);
        });
      }
    ], function(err, gallery) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(201, gallery);
    });
  }
};

// Updates an existing document in the DB.
exports.update = function(req, res) {
  if (req.body && req.params.id) {
    var data = {
      title: req.body.title,
      media: req.body.media,
      body: req.body.body,
      modifiedAt: Date.now()
    };

    async.waterfall([
      function getgallery(callback) {
        Gallery.findOneAndUpdate({
          _id: req.params.id
        }, data, function(err, gallery) {
          if (err) {
            callback(err);
          }

          callback(null, gallery);
        });
      },
      function populateUser(gallery, callback) {
        var options = {
          path: 'createdBy',
          model: 'User',
          select: '-hashedPassword -salt -provider -__v'
        };

        User.populate(gallery, options, function(err, gallery) {
          if (err) {
            callback(err);
          }

          callback(null, gallery);
        });
      },
      function populateMedia(gallery, callback) {
        var options = {
          path: 'media',
          model: 'Media'
        };

        Media.populate(gallery, options, function(err, gallery) {
          if (err) {
            callback(err);
          }

          callback(null, gallery);
        });
      }
    ], function(err, gallery) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(200, gallery);
    });

    Gallery.findOneAndUpdate({
      _id: req.params.id
    }, data, function(err, doc) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(200, doc);
    });
  }
};

// Updates an existing document in the DB.
exports.updatePost = function(req, res) {
  if (req.body && req.params.id) {
    var data = {
      title: req.body.title,
      media: req.body.media,
      body: req.body.body,
      modifiedAt: Date.now()
    };

    async.waterfall([
      function getgallery(callback) {
        Gallery.findOneAndUpdate({
          _id: req.params.id
        }, data, function(err, gallery) {
          if (err) {
            callback(err);
          }

          callback(null, gallery);
        });
      },
      function populateUser(gallery, callback) {
        var options = {
          path: 'createdBy',
          model: 'User',
          select: '-hashedPassword -salt -provider -__v'
        };

        User.populate(gallery, options, function(err, gallery) {
          if (err) {
            callback(err);
          }

          callback(null, gallery);
        });
      },
      function populateMedia(gallery, callback) {
        var options = {
          path: 'media',
          model: 'Media'
        };

        Media.populate(gallery, options, function(err, gallery) {
          if (err) {
            callback(err);
          }

          callback(null, gallery);
        });
      }
    ], function(err, gallery) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(200, gallery);
    });
  }
};

// Deletes a document from the DB.
exports.destroy = function(req, res) {
  Gallery.findById(req.params.id, function(err, gallery) {
    if (err) {
      return handleError(res, err);
    }
    if (!gallery) {
      return res.send(404);
    }
    gallery.remove(function(err) {
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
