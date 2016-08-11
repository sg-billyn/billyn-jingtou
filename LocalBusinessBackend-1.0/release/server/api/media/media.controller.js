'use strict';

var _ = require('lodash'),
  Media = require('./media.model'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  s3 = require('s3'),
  async = require('async'),
  config = require('./../../config/environment');

  var BUCKET         = config.s3.bucket,
      UPLOAD_DIR     = config.s3.uploadDir,
      AWS_ACCESS_KEY = config.s3.accessKey,
      AWS_SECRET_KEY = config.s3.secretKey;

var client = s3.createClient({
  maxAsyncS3: 20,                     // this is the default
  s3RetryCount: 3,                    // this is the default
  s3RetryDelay: 1000,                 // this is the default
  multipartUploadThreshold: 20971520, // this is the default (20 MB)
  multipartUploadSize: 15728640,      // this is the default (15 MB)
  s3Options: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY
  }
});

/**
 * A helper to upload the images from file system to AWS S3 storage
 */
function uploader(req, res) {
  var uploadData = {};

  if (req.body) {
    // get the file name which will be used for S3 as well
    var targetFilename = req.body.file.path.split('/').slice(-1)[0];
    var targetKey = UPLOAD_DIR + req.user._id.toString() + '/' + targetFilename;

    uploadData = {
      userId: req.user._id,
      key: targetKey,
      createdAt: Date.now(),
      modifiedAt: Date.now()
    };
  }

  var params = {
    localFile: req.body.file.path,
    s3Params: {
      Bucket: BUCKET,
      Key: uploadData.key,
      ACL: 'public-read-write'
    }
  };

  var uploadHandler = client.uploadFile(params);

  uploadHandler.on('error', function(err) {
    handleError(res, err);
  });

  uploadHandler.on('end', function(data) {
    uploadData.uri = s3.getPublicUrlHttp(config.s3.bucket, uploadData.key);

    // omit the picture field when picture is not provided
    // or maybe we can provide a default picture
    if (uploadData.uri === '') delete uploadData.uri;

    // delete the image stored on local file system
    fs.unlink(req.body.file.path, function() {
      Media.create(uploadData, function(err, doc) {
        if (err) return res.json(500, err);

        return res.json(201, {
          url: 'http://localhost:9000/api/uploads/' + doc._id,
          jsonrpc: '2.0',
          result: doc
        });
      });
    });
  });
}

/**
 * Get the media key by extracting it from the URL.
 * @param {Array} mediaUrls List of the media url
 * @returns {Array} keys of the media
 */
function getKeys(mediaUrls) {
  var key = '';
  var keys = [];

  for(var i=0; i < mediaUrls.length; i++) {
    var token = "s3.amazonaws.com/";
    var url = mediaUrls[i];
    key = url.substring(url.indexOf(token)).replace(token, "");
    keys.push(key);
  }

  return keys
}

/**
 * Populate the objects that contained the list of medias that will be deleted
 * by S3 client.
 * @param {Array} keys List of the keys
 * @returns {Array} objects that contained the key of media will be deleted
 */
function populateObjects(keys) {
  var objects = [];

  for(var i=0; i < keys.length; i++) {
    objects.push({
      Key: keys[i]
    });
  }

  return objects;
}

/**
 * A helper to delete the list of media.
 * @param {Array} mediaUrls List of the media url
 * @param {Function} Callback function
 */
function deleter(mediaUrls, cb) {
  var keys = getKeys(mediaUrls);
  var objects = populateObjects(keys);

  var params = {
    Bucket: config.s3.bucket,
    Delete: {
      Objects: objects
    }
  };

  client.deleteObjects(params)
    .on('error', function(err) {
      cb(err);
    })
    .on('end', function() {
      cb(null, true);
    });
}

/**
 * Creates a new media
 */
exports.create = function(req, res) {
  uploader(req, res);
  // return res.json(201, {
  //   result: req.files
  // });
};

exports.show = function(req, res) {
  Media.findOne({
    _id: mongoose.Types.ObjectId(req.params.id),
    createdBy: req.user._id.toString()
  }, function(err, doc) {

    if (err) {
      return handleError(res, err);
    }

    if (doc) {
      return res.json(200, {
        url: 'http://localhost/api/uploads/' + doc._id,
        jsonrpc: '2.0',
        result: doc
      });
    }

    if (doc === null) {

      return res.json(404, {
        message: 'The media you are looking for is not exist'
      });
    }
  });
};

/**
 * Delete media
 */
exports.destroy = function(req, res) {
  var mediaUrls = [];

  Media.findById(req.params.id, function(err, media) {
    if (err) {
      handleError(res, err);
    }

    if(!media) {
      return res.json(404, {
        message: 'The media you are looking for is not exist'
      });
    }

    mediaUrls.push(media.uri);

    deleter(mediaUrls, function(err, result) {
      if (err) {
        handleError(res, err);
      }

      if (result) {
        media.remove(function(err) {
        if (err) {
          return handleError(res, err);
        }

          return res.send(204);
        });
      }
    });
  });
};

/**
 * Delete list of media.
 * The handler expecting a list of media in request body.
 */
exports.destroyList = function (req, res) {
  var medias = req.body.medias;

  // TODO refactor this flow to waterfall/series flow to avoid the nested
  async.concat(medias, Media.findById.bind(Media), function (err, results) {
    if(results.length === 0) {
      return res.json(404, {
        message: 'The media list contained a media that is not exist'
      });
    }

    var mediaUrls = [];

    for (var i=0; i < results.length; i++) {
      mediaUrls.push(results[i].uri);
    }

    deleter(mediaUrls, function(err, result) {
      if (err) {
        handleError(res, err);
      }

      if (result) {
        async.concat(medias, Media.findByIdAndRemove.bind(Media), function (err, results) {
          if (err) {
            handleError(res, err);
          }

          return res.send(204);
        });
      }
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
