'use strict';

var _ = require('lodash');
var Account = require('./account.model');

function placeholder(userId){

    var prefs = {
      createdBy: userId,
      business: {
        name: 'Example Co.',
        description: '',
        hours: {
          zone : 0, //GMT +x
          days :[{
            day :  1,
            openAt : 1417248005669,
            closeAt : 1417284005677
          },
          {
            day :  2,
            openAt : 1417248005669,
            closeAt : 1417284005677
          },
          {
            day :  3,
            openAt : 1417248005669,
            closeAt : 1417284005677
          },
          {
            day :  4,
            openAt : 1417248005669,
            closeAt : 1417284005677
          },
          {
            day :  5,
            openAt : 1417248005669,
            closeAt : 1417284005677
          }]
        },
        website: '',
        email: '',
        address: '',
        city: '',
        zipcode: '',
        latlong: '',
        zoom: ''
      },
      contact: {
        name: '',
        phone: '',
        email: ''
      },
      media: [],
      createdAt: Date.now(),
      modifiedAt: Date.now()
    }

    return prefs;
}

function find(userId, res){
  Account.find({
    createdBy: userId //req.user._id
  })
  .populate({
    path: 'createdBy',
    select: '-hashedPassword -salt -provider -__v',
    options: {
      weight: 1
    }
  })
  .populate('media')
  .exec(function (err, accounts) {
    if(err) { return handleError(res, err); }

      if(accounts.length < 1) {
        console.log("There is no account for this user yet. Let's create.")
        Account.create(placeholder(userId), function(err, accounts) {
          console.log("Initial accounts record created.")
          if(err) { return handleError(res, err); }
            return res.json(201, {result: [accounts]});
          });
        }else{
          return res.json(200, {result: accounts});
        }
      });
}

var pub = {

  index: function(req, res) {

    Account.find({}, '-contact')
    .populate({
      path: 'createdBy',
      select: '-email -role -hashedPassword -salt -provider -__v',
      options: {
        weight: 1
      }
    })
    .populate('media')
    .exec(function (err, accounts) {
      if(err) { return handleError(res, err); }
      // Filter out the entries with reference to non existing users

      var filtered = accounts.filter(function(e){
        console.log("Checking, createdBy: " + e.createdBy);
        return ((e.createdBy !== null) && (e.createdBy.name !== "Admin")) ;
      });

      return res.json(200, {result: filtered});

    });

  }
}

// Get public list of accounts
exports.public = pub

// Get list of accounts
exports.index = function(req, res) {
  return find(req.user._id, res);
};

// Get list of accounts
exports.find = function(req, res) {
  return find(req.params.user_id, res);
};

// Get a single accounts
exports.show = function(req, res) {
  Account.findById(req.params.id)
    .populate('createdBy', '-hashedPassword -salt -provider -__v')
    .populate('media')
    .exec(function (err, accounts) {
      if(err) {
        return handleError(res, err);
      }
      if(!accounts) {
        return res.send(404);
      }
      return res.json({result: accounts});
    });
};

// Creates a new accounts in the DB.
exports.create = function(req, res) {

  var body = req.body;

  body.createdAt = Date.now();
  body.modifiedAt = Date.now();

  console.log("Create prefs: " + body);

  Account.create(/*req.body*/ body, function(err, accounts) {
    if(err) { return handleError(res, err); }
    return res.json(201, accounts);
  });
};

// Updates an existing accounts in the DB.
exports.update = function(req, res) {
  // if(req.body._id) { delete req.body._id; }
  // Account.findById(req.params.id, function (err, accounts) {
  //   if (err) { return handleError(res, err); }
  //   if(!accounts) { return res.send(404); }
  //   var updated = _.merge(accounts, req.body);
  //   console.log("[accounts] body    : %o", req.body);
  //   console.log("[accounts] updated : %o", updated);
  //   updated.save(function (err) {
  //     if (err) { return handleError(res, err); }
  //     return res.json(200, {result: accounts});
  //   });
  // });

  var id = req.body._id;
  if(req.body._id) {
    delete req.body._id;
  }

  if(req.body.createdBy) {
    delete req.body.createdBy;
  }

  req.body.modifiedAt = Date.now();

  var data = req.body;
  console.log("Accounts update:", data);

  Account.findOneAndUpdate({
    _id: id
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

// Deletes a accounts from the DB.
// exports.destroy = function(req, res) {
//   Account.findById(req.params.id, function (err, accounts) {
//     if(err) { return handleError(res, err); }
//     if(!settings) { return res.send(404); }
//     accounts.remove(function(err) {
//       if(err) { return handleError(res, err); }
//       return res.send(204);
//     });
//   });
// };

function handleError(res, err) {
  console.log('[Accounts API] %o', err);
  return res.send(500, err);
}
