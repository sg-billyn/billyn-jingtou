'use strict';

var _ = require('lodash');
var Page = require('./page.model');

// Get list of pages
exports.index = function(req, res) {
  // Page.find(function (err, pages) {
  //   if(err) { return handleError(res, err); }
  //   return res.json(200, pages);
  // });

  Page.paginate({
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

// Get a single page
exports.show = function(req, res) {
  Page
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

// Creates a new page in the DB.
exports.create = function(req, res) {

  if (req.body) {
    var data = {
      createdBy: req.user._id,
      title: req.body.title,
      teaser: req.body.teaser,
      media: req.body.media,
      body: req.body.body,
      createdAt: Date.now(),
      modifiedAt: Date.now()
    };

    Page.create(data, function(err, page) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(201, {
        result: page
      });
    });

  }
};

// Updates an existing page in the DB.
exports.update = function(req, res) {
  if (req.body && req.params.id) {
    var data = {
      title: req.body.title,
      teaser: req.body.teaser,
      media: req.body.media,
      body: req.body.body,
      modifiedAt: Date.now()
    };

    Page.findOneAndUpdate({
      _id: req.params.id
    }, data, function(err, doc) {
      if (err) {
        return res.json(500);
      } else {
        return res.json(200, {
          url: 'http://localhost/api/news/' + doc._id,
          jsonrpc: '2.0',
          result: doc
        });
      }
    });
  }
};

// Deletes a page from the DB.
exports.destroy = function(req, res) {
  Page.findById(req.params.id, function(err, page) {
    if (err) {
      return handleError(res, err);
    }
    if (!page) {
      return res.send(404);
    }
    page.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  console.log(err);
  return res.send(500, err);
}
