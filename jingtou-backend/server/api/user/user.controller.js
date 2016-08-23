'use strict';

import {User} from '../../sqldb';
import {UserRole} from '../../sqldb';
import {UserProfile} from '../../sqldb';
import {UserGroup} from '../../sqldb';
import {Role} from '../../sqldb';
import {Space} from '../../sqldb';
import {Circle} from '../../sqldb';
import passport from 'passport';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
var Promise = require('bluebird');

function respondWithResult(res, statusCode) {

  statusCode = statusCode || 200;
  return function (entity) {
    //console.log('response entity:', JSON.stringify(entity));
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function (entity) {
    return entity.updateAttributes(updates)
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function (err) {
    res.status(statusCode).json(err);
  }
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {

  User.belongsToMany(Role, { as: 'roles', through: UserRole });
  Role.belongsToMany(User, { as: 'users', through: UserRole });

  User.findAll({
    attributes: [
      '_id',
      'name',
      'loginId',
      'email',
      //'role',
      'provider'
    ],
    include: [
      {
        model: Role, as: 'roles'
      }
    ]
  })
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res, next) {
  var newUser = User.build(req.body);
  newUser.setDataValue('provider', 'local');
  newUser.setDataValue('role', 'user');
  newUser.save()
    .then(function (user) {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({ token });
    })
    .catch(validationError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  User.belongsToMany(Role, { as: 'roles', through: UserRole });
  Role.belongsToMany(User, { as: 'users', through: UserRole });

  User.find({
    where: {
      _id: userId
    },
    include: [
      {
        model: Role, as: 'roles'
      }
    ]
  })
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  User.destroy({ _id: req.params.id })
    .then(function () {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.find({
    where: {
      _id: userId
    }
  })
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;
  //console.log('req header',req.headers);

  User.belongsToMany(Role, { as: 'roles', through: UserRole });
  Role.belongsToMany(User, { as: 'users', through: UserRole });

  return User.find({
    where: {
      _id: userId
    },
    attributes: [
      '_id',
      'name',
      'email',
      'loginId',
      'role',
      'provider'
    ],
    include: [
      {
        model: Role, as: 'roles'
      }
    ]
  })
    .then(user => { // don't ever give out the password or salt
      //console.log('me user:', JSON.stringify(user));
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res, next) {
  res.redirect('/');
}

function findAllProfile(req, res) {

  UserProfile.belongsTo(User, { as: 'user' });
  UserProfile.belongsTo(Role, { as: 'role' });
  UserProfile.belongsTo(Circle, { as: 'circle' });
  UserProfile.belongsTo(Space, { as: 'space' });

  var query = req.query;
  var includeData = [];
  var whereData = {};

  includeData.push(
    {
      model: User, as: 'user'
    }
  );

  if (query.spaceId) {
    includeData.push(
      {
        model: Space, as: 'space'
      }
    );
    whereData.spaceId = query.spaceId;
  }

  if (query.circleId) {
    includeData.push(
      {
        model: Circle, as: 'circle'
      }
    );
    whereData.circleId = query.circleId;
  }

  if (query.roleId) {
    includeData.push(
      {
        model: Role, as: 'role'
      }
    );
    whereData.roleId = query.roleId;
  }

  if (query.userId) {
    whereData.userId = query.userId;
  }

  return UserProfile.findAll(
    {
      where: whereData,
      include: includeData
    }
  )
}

export function queryAllProfile(req, res) {
  return findAllProfile(req, res)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

export function bulkAddProfile(req, res) {

  UserProfile.belongsTo(User, { as: 'user' });
  UserProfile.belongsTo(Role, { as: 'role' });
  UserProfile.belongsTo(Circle, { as: 'circle' });
  UserProfile.belongsTo(Space, { as: 'space' });

  var body = req.body;
  var bulkData = body.data;

  if (body.spaceId) {
    var spaceId = body.spaceId;
    bulkData.forEach(function (o) {
      o.spaceId = o.spaceId || spaceId;
    })
  }

  if (body.circleId) {
    var circleId = body.circleId;
    bulkData.forEach(function (o) {
      o.spaceId = o.circleId || circleId;
    })
  }

  var results = [];

  return Promise.map(bulkData, function (data) {
    var whereData = {};

    whereData.userId = data.userId;
    if (data.spaceId) {
      whereData.spaceId = data.spaceId;
    }
    if (data.circleId) {
      whereData.circleId = data.circleId;
    }
    if (data.roleId) {
      whereData.roleId = data.roleId;
    }
    UserProfile.findOrCreate(
      {
        where: whereData,
        defaults: data
      }
    ).then(function (entity, created) {
      results.push(entity);
    })
  }).then(function () {
    return Promise.resolve(results);
  })
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

export function addUserGroup(req, res) {

  return UserGroup.add(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

export function findAllUserGroup(req, res) {

  return UserGroup.findAllByQuery(req.query)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

export function findOneUserGroup(req, res) {
  var query = {};

  if (req.params.id) {
    query.id = req.params.id;
  }
  if (req.query) {
    query = req.query;
  }

  return UserGroup.findOneByQuery(query)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

