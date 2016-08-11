'use strict';

var _ = require('lodash'),
  rand = require('random-key'),
  uuid = require('node-uuid'),
  password = require('password'),
  Client = require('./client.model');

// Get list of clients
exports.index = function(req, res) {
  Client
    .find({
      createdBy: req.user._id.toString()
    })
    .populate({
      path: 'createdBy',
      select: '-hashedPassword -salt -__v'
    })
    .exec(function(err, clients) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(200, {
        result: clients
      });
    });
};

// Get a single client
exports.show = function(req, res) {
  Client
    .findById(req.params.id)
    .populate('createdBy', '-hashedPassword -salt -provider -__v')
    .exec(function(err, client) {
      if (err) {
        return handleError(res, err);
      }
      if (!client) {
        return res.send(404);
      }

      return res.json(200, client);

    });
};

// Creates a new client in the DB.
exports.create = function(req, res) {
  if (req.body) {
    var data = {
      createdBy: req.user._id.toString(),
      name: req.body.name,
      clientId: req.body.clientId,
      clientSecret: req.body.clientSecret,
      createdAt: Date.now(),
      modifiedAt: Date.now()
    };

    Client.create(data, function(err, doc) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(201, doc);

    });
  }
};

// Updates an existing client in the DB.
exports.update = function(req, res) {
  var body = req.body;

  var data = {
    name: req.body.name,
    modifiedAt: Date.now()
  };

  if (body.clientId && body.clientSecret) {
    data.clientId = body.clientId;
    data.clientSecret = body.clientSecret;
  }

  Client.findOneAndUpdate({
    _id: req.params.id
  }, data, function(err, doc) {
    if (err) {
      handleError(res, err);
    } else {
      return res.json(200, doc);
    }
  });
};

// Delete record
exports.destroy = function(req, res) {
  Client.findById(req.params.id, function(err, client) {
    if (err) {
      return handleError(res, err);
    }
    if (!client) {
      return res.send(404);
    }
    client.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

// Generate new client credentials
exports.generateKeys = function(req, res) {
  console.log("Credentials gerenation requested.")
  return res.json(200, {
    result: {
      clientId: uuid.v4(),
      clientSecret: rand.generate()
    }
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
