'use strict';

var _ = require('lodash');
var Review = require('./review.model');

var pub = {
  index: function(req, res) {

    Review.find({
      createdBy: req.params.createdBy
    })
    .populate({
      path: 'createdBy category',
      select: '-hashedPassword -salt -provider -__v',
      options: {
        weight: 1
      }
    })
    .populate('media')
    .exec(function(err, items) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(200, {
        result: items
      });
    })
  }
}

// Get list of reviews
exports.public = pub;

// Get list of reviews
exports.index = function(req, res) {
  // Review.find(function (err, reviews) {
  //   if(err) { return handleError(res, err); }
  //   return res.json(200, reviews);
  // });

  Review.paginate({
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

    res.json(200, {
      page: provider.page,
      total: provider.docs.length,
      num_pages: provider.pages,
      result: provider.docs
    });
  });

};

// Get a single review
exports.show = function(req, res) {
  // Review.findById(req.params.id, function (err, review) {
  //   if(err) { return handleError(res, err); }
  //   if(!review) { return res.send(404); }
  //   return res.json(review);
  // });

  Review
  .findById(req.params.id)
  .populate('createdBy', '-hashedPassword -salt -provider -__v')
  .populate('media')
  .exec(function(err, page) {
    if (err) {
      return handleError(res, err);
    }
    if (!page) {
      return res.send(404);
    }

    return res.json(200, {
      result: page
    });
  });
};

// Creates a new review in the DB.
exports.create = function(req, res) {

  var data = {
    createdBy: req.user._id,
    title: req.body.title,
    teaser: req.body.teaser,
    body: req.body.body,
    media: req.body.media,
    createdAt: Date.now(),
    modifiedAt: Date.now()
  };

  Review.create(data, function(err, review) {
    if(err) { return handleError(res, err); }
    return res.json(201, review);
  });
};

// Updates an existing review in the DB.
exports.update = function(req, res) {

  var data = {
    title: req.body.title,
    teaser: req.body.teaser,
    body: req.body.body,
    media: req.body.media,

    modifiedAt: Date.now()
  };

  Review.findOneAndUpdate({
    _id: req.params.id
  }, data, function(err, doc) {
    if (err) {
      return res.json(500);
    } else {
      return res.json(200, {
        result: doc
      });
    }
  });

};

// Deletes a review from the DB.
exports.destroy = function(req, res) {
  Review.findById(req.params.id, function (err, review) {
    if(err) { return handleError(res, err); }
    if(!review) { return res.send(404); }
    review.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  console.log(err);
  return res.send(500, err);
}
