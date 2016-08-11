'use strict';

var _ = require('lodash'),
async = require('async'),
Article = require('./article.model'),
User = require('./../user/user.model'),
Media = require('./../media/media.model'),
mongoose = require('mongoose');

/**
 * Get list of records
 */
 exports.index = function(req, res) {
   async.waterfall([
     function getListofArticles(callback) {
       Article.paginate({
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

       User.populate(provider.docs, options, function(err, articles) {
         if (err) {
           callback(err);
         }

         provider.docs = articles;
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

/**
 * Get single record
 */
function getSingleArticle(req, res) {
  Article
    .findOne({
      _id: mongoose.Types.ObjectId(req.params.id),
      createdBy: req.user._id.toString()
    })
    .populate('createdBy', '-hashedPassword -salt -provider -__v')
    .populate('media')
    .exec(function(err, doc) {
      if (err) {
        return handleError(res, err);
      }

      if (doc) {
        return res.json(200, {
          url: 'http://localhost/api/article/' + doc._id,
          jsonrpc: '2.0',
          result: doc
        });
      }

      if (doc === null) {

        return res.send(404, {
          message: 'The document you are looking for is not exist'
        });
      }
    });
}


/**
 * Get a single record
 */
exports.show = function(req, res) {
  getSingleArticle(req, res);
};

/**
 * Create an array of the provided tags. Keep the array empty
 * in the case where no tags have been passed.
 */
function safeSplit(value){

  var arr = [];
  // Ingore any error in the attempt to split the tags into an array.
  try {
    arr = value.split(',');
  } catch (e) {

  } finally {

  }
  return arr;
}

// Creates a record in the DB.
exports.create = function(req, res) {

  if (req.body) {
    /*
    var data = {
      createdBy: req.user._id.toString(),
      title: req.body.title,
      tags: req.body.tags.split(','),
      body: req.body.body,
      media: req.body.media,
      createdAt: Date.now(),
      modifiedAt: Date.now()
    };
    */

    var tagsArray = safeSplit(req.body.tags);

    // Delete the tags field. It should not be part of the
    // object that will be serialized.
    delete req.body.tags;

    var data        = req.body;
    data.createdBy  = req.user._id.toString();
    data.tags       = tagsArray;
    data.createdAt  = Date.now();
    data.modifiedAt = Date.now();

    async.waterfall([
      function createArticle(callback) {
        Article.create(data, function(err, article) {
          if (err) {
            callback(err, null);
          }

          callback(null, article);
        });
      },
      function populateUser(article, callback) {
        var options = {
          path: 'createdBy',
          model: 'User',
          select: '-hashedPassword -salt -provider -__v'
        };

        User.populate(article, options, function(err, populatedUser) {
          if (err) {
            callback(err);
          }

          callback(null, populatedUser);
        });
      },
      function populateMedia(article, callback) {
        var options = {
          path: 'media',
          model: 'Media'
        };

        Media.populate(article, options, function(err, populatedMedia) {
          if (err) {
            callback(err);
          }

          callback(null, populatedMedia);
        });
      }
    ], function(err, article) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(201, article);
    });
  }
};

// Updates an existing document in the DB.
exports.update = function(req, res) {
  if (req.body && req.params.id) {
      /*
      var data = {
        title: req.body.title,
        tags: req.body.tags.split(','),
        body: req.body.body,
        media: req.body.media,
        modifiedAt: Date.now()
      };
    */
    var tagsArray = safeSplit(req.body.tags);

    // Delete the tags field. It should not be part of the
    // object that will be serialized.
    delete req.body.tags;

    var data        = req.body;
    data.createdBy  = req.user._id.toString();
    data.tags       = tagsArray;
    data.modifiedAt = Date.now();
    delete data.createdBy;

    async.waterfall([
      function getArticle(callback) {
        Article.findOneAndUpdate({
          _id: req.params.id
        }, data, function(err, article) {
          if (err) {
            callback(err);
          }

          callback(null, article);
        });
      },
      function populateUser(article, callback) {
        var options = {
          path: 'createdBy',
          model: 'User',
          select: '-hashedPassword -salt -provider -__v'
        };

        User.populate(article, options, function(err, result) {
          if (err) {
            callback(err);
          }

          callback(null, result);
        });
      },
      function populateMedia(article, callback) {
        var options = {
          path: 'media',
          model: 'Media'
        };

        Media.populate(article, options, function(err, result) {
          if (err) {
            callback(err);
          }

          callback(null, result);
        });
      }
    ], function(err, article) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(200, article);
    });
  }
};
/**
 * Delete record
 */
exports.destroy = function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    if (err) {
      return handleError(res, err);
    }
    if (!article) {
      return res.send(404);
    }
    article.remove(function(err) {
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
