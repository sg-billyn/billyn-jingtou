/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/spaces              ->  index
 * POST    /api/spaces              ->  create
 * GET     /api/spaces/:id          ->  show
 * PUT     /api/spaces/:id          ->  update
 * DELETE  /api/spaces/:id          ->  destroy
 * GET	   /api/spaces/user/:id     ->  findUserSpaces
 */

/**
 * Provides the base sever side restful api under space module
 * 
 * Using Rails-like standard naming convention for endpoints.
 * 
 * GET     /api/spaces              ->  index
 * POST    /api/spaces              ->  create
 * GET     /api/spaces/:id          ->  show
 * PUT     /api/spaces/:id          ->  update
 * DELETE  /api/spaces/:id          ->  destroy
 * GET	   /api/spaces/user/:id     ->  findUserSpaces
 * POST    /api/spaces/:id?userId   ->  userJoin
 * 
 * @module server/api/space
 */
'use strict';

import _ from 'lodash';
import {Space} from '../../sqldb';
import {UserRole} from '../../sqldb';
import {Role} from '../../sqldb';
import {Category} from '../../sqldb';
import {SpaceApp} from '../../sqldb';
import {App} from '../../sqldb';
import {Nut} from '../../sqldb';
import {User} from '../../sqldb';
import {PermitRole} from '../../sqldb';
import {Permit} from '../../sqldb';
import Sequelize from 'sequelize';

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

/**
 * get all spaces according to condition
 * @method module:server/api/space.method:index
 * @returns {Array} array of spaces, format like: [ {_id: xxx, name: xxx, apps:[], roles:[], type:{},...},...]
 */
export function index(req, res) {

    App.belongsTo(Category, { as: 'type' });
    //App.belongsTo(Space, { as: 'space' });
    Space.belongsTo(Category, { as: 'type' });
    Space.hasMany(App, { as: 'apps' });
    Space.hasMany(Role, { as: 'roles' });
    Role.hasMany(PermitRole, { as: 'rolePermits' });
    PermitRole.belongsTo(Permit, { as: 'permit' });
    PermitRole.belongsTo(Role, { as: 'guestRole', foreignKey: 'ownerId' });

    var findData = req.body;
    var includeData = [{
        model: Category, as: 'type'
        //where: { _id: Sequelize.col('Spaces.typeId') }
    }];
    if (findData.type) {
        Space.getType(findData.type)
            .then(function (type) {
                findData.typeId = type._id;
                delete findData.type;
                return Promise.resolve(findData);
            }).then(function (findData) {
                return Space.findAll({
                    where: findData,
                    include: [
                        {
                            model: Category,
                            as: 'type'
                        },
                        {
                            model: App,
                            as: 'apps',
                            include: {
                                model: Category, as: 'type'
                            }
                        },
                        {
                            model: Role,
                            as: 'roles',
                            where: {
                                fullname: {
                                    $ne: 'root.role'
                                }
                            }
                        },
                    ]
                })
            })
            .then(respondWithResult(res))
            .catch(handleError(res));
    } else {
        Space.findAll({
            where: findData,
            include: [
                {
                    model: Category,
                    as: 'type'
                },
                {
                    model: App,
                    as: 'apps',
                    include: {
                        model: Category, as: 'type'
                    }
                },
                {
                    model: Role,
                    as: 'roles',
                    where: {
                        fullname: {
                            $ne: 'root.role'
                        }
                    }
                },
            ]
        })
            .then(respondWithResult(res))
            .catch(handleError(res));
    }
}

/**
 * get single space
 * @method module:server/api/space.method:show
 * @returns {Object} space object, format like: {_id: xxx, name: xxx, apps:[], roles:[], type:{},...}
 */
export function show(req, res) {

    //console.log(req.params.id);
    if (req.params.id && req.params.id === 'user') {
        return findUserSpaces(req, res);
    }

    //console.log('1');

    App.belongsTo(Category, { as: 'type' });
    //App.belongsTo(Space, { as: 'space' });
    Space.belongsTo(Category, { as: 'type' });
    Space.hasMany(App, { as: 'apps' });
    Space.hasMany(Role, { as: 'roles' });
    App.hasMany(Nut, { as: 'nuts' });
    Nut.hasMany(PermitRole, { foreignKey: 'ownerId', as: 'permitRoles' });
    Nut.belongsTo(Category, { as: 'type' });
    Role.hasMany(PermitRole, { foreignKey: 'ownerId', as: 'permitRoles' })

    //console.log('2');

    return Space.find({
        where: {
            _id: req.params.id
        },
        include: [
            {
                model: Category,
                as: 'type'
            },
            {
                model: App,
                as: 'apps',
                include: [
                    {
                        model: Category, as: 'type'
                    },
                    {
                        model: Nut, as: 'nuts',
                        include: [
                            {
                                model: Category, as: 'type'
                            },
                            {
                                model: PermitRole, as: 'permitRoles',
                                where: {
                                    'owner': 'nut'
                                },
                                include: [
                                    {
                                        model: Permit, as: 'permit'
                                    },
                                    {
                                        model: Role, as: 'role'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                model: Role,
                as: 'roles',
                where: {
                    fullname: {
                        $ne: 'root.role'
                    }
                }
            },
        ]
    })
        /*.then(function(space) {
            //console.log('space:', JSON.stringify(space));
            var oSpace = JSON.parse(JSON.stringify(space));
            return Space.getType(space.typeId).then(function(type) {
                oSpace.type = type;
                return Promise.resolve(oSpace);
            }).then(function(oSpace) {
                //console.log('3 oSpace:',JSON.stringify(oSpace));
                return App.findAll({
                    where: {
                        spaceId: oSpace._id
                    },
                    include: {
                        model: Category,
                        as: 'type'
                    }
                });
            }).then(function(sApps) {
                //console.log('4 apps', apps);
                //console.log('4 apps', JSON.stringify(sApps));
                oSpace.apps = sApps;
                //console.log('5 oSpace', JSON.stringify(oSpace));
                return Promise.resolve(oSpace);
            });
        })*/
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

/**
 * create a new space, this function call Space model add function to complete create of space
 * please see Space.add function for more information of creating space
 * @method module:server/api/space.method:create
 * @param req.body {object}, format like: {name:xxx, alias:xxx, type:{name:xxx, alias:xxx}, roles: [{...}...]}
 * @returns {Array} array of spaces, format like: [ {_id: xxx, name: xxx, apps:[], roles:[], type:{},...},...]
 */
export function create(req, res) {
    //console.log('space create req.body:', JSON.stringify(req.body));
    var spaceData = req.body;
    Space.add(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
    /*
    var typeName;
    var newSpace;
    for (var key in spaceData) {
        if (key.toLowerCase() === 'type' || key.toLowerCase() === 'typename') {
            typeName = spaceData[key];
            delete spaceData[key];
        }
    }
 
    if (typeName) {
        Space.addType(typeName).then(function (type) {
            spaceData.typeId = type._id;
            Space.create(spaceData)
                .then(function (space) {
                    newSpace = JSON.parse(JSON.stringify(space));
                    return Space.getType(space.typeId).then(function (type) {
                        var newSpace = JSON.parse(JSON.stringify(space));
                        newSpace.type = type;
                        return Promise.resolve(newSpace);
                    });
                })
                .then(respondWithResult(res, 201))
                .catch(handleError(res));
        })
    } else {
        Space.create(spaceData)
            .then(function (space) {
                newSpace = JSON.parse(JSON.stringify(space));
                return Space.getType(space.typeId).then(function (type) {
                    var newSpace = JSON.parse(JSON.stringify(space));
                    newSpace.type = type;
                    return Promise.resolve(newSpace);
                });
            })*/


}

// Updates an existing Space in the DB
export function update(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Space.find({
        where: {
            _id: req.params.id
        }
    }).then(function (space) {
        newSpace = JSON.parse(JSON.stringify(space));
        return Space.getType(space.typeId).then(function (type) {
            var newSpace = JSON.parse(JSON.stringify(space));
            newSpace.type = type;
            return Promise.resolve(newSpace);
        });
		  })
        .then(handleEntityNotFound(res))
        .then(saveUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a Space from the DB
export function destroy(req, res) {
    Space.find({
        where: {
            _id: req.params.id
        }
    })
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}

/**
 * create a new space, this function call Space model add function to complete create of space
 * please see Space.add function for more information of creating space
 * @method module:server/api/space.method:findUserSpaces
 * @param req.query.userId {int} userId to join
 * @returns {Array} array of spaces under user, format like: [ 
 * {_id: xxx, name: xxx, roles:[], type:{}, apps: [ {_id:xxx, name: xxx, nuts: [{_id: xxx, name: xxx, permitRoles: [{
 *      permit: {}, nut: {}, role: {}
 * }]}]} ]...},...]
 * attention is: apps array only contain apps user can access, meanwhile roles only contain user's roles under space
 */
export function findUserSpaces(req, res) {

    //console.log('findUserSpaces req.params', JSON.stringify(req.params));
    //console.log('findUserSpaces req.query', JSON.stringify(req.query));

    App.belongsTo(Category, { as: 'type' });

    UserRole.belongsTo(Space, { as: 'space' });
    Space.belongsTo(Category, { as: 'type' });
    //console.log('in findUserSpaces');
    //console.log('params:', JSON.stringify(req.params));
    var query = req.query;
    if (query) {
        //console.log('findUserSpaces query', JSON.stringify(query));

        Space.belongsTo(Category, { as: 'type' });
        //console.log(1);
        Space.hasMany(Role, { as: 'roles', foreignKey: 'spaceId' });
        Space.hasMany(UserRole, { as: 'userRoles'});
        //console.log(2);
        Role.belongsToMany(User, { through: 'UserRole', as: 'users' });
        //console.log(3);
        Space.hasMany(App, { as: 'apps' });
        //console.log(4);
        App.belongsTo(Category, { as: 'type' });
        //console.log(5);
        App.hasMany(Nut, { as: 'nuts' });
        Nut.belongsTo(Category, { as: 'type' });
        //console.log(6);
        Nut.hasMany(PermitRole, { foreignKey: 'ownerId', as: 'permitRoles' });
        //console.log(7);
        PermitRole.belongsTo(Permit, { as: 'permit' });
        //console.log(8);
        PermitRole.belongsTo(Role, { as: 'role' });
        //console.log(9);
        UserRole.belongsTo(Role, { as: 'role' });

        var findSpaceWhere = {};

        //for find one space
        for (var key in query) {
            if (key.toLocaleLowerCase() === 'id' || key.toLocaleLowerCase() === 'spaceid' || key.toLocaleLowerCase() === '_id') {
                findSpaceWhere._id = query[key];
            }
        }

        //console.log('query:',JSON.stringify(req.query));
        if (!query.userId && req.user._id) {
            query.userId = req.user._id;
        }

        //console.log('query:',JSON.stringify(req.query));
        var joinStatus = ['joined'];
        if (req.query.joinStatus) {
            //console.log('joinStatus', joinStatus);
            if(typeof req.query.joinStatus === 'array'){
                joinStatus = req.query.joinStatus;
            }
            if(typeof req.query.joinStatus === 'string'){
                if(!joinStatus.includes(req.query.joinStatus)){
                    joinStatus.push(req.query.joinStatus);
                }
            }
            joinStatus = req.query.joinStatus;
        }

        //console.log('query:', JSON.stringify(query));

        //console.log('findSpaceWhere:', JSON.stringify(findSpaceWhere));

        //console.log('joinStatus', joinStatus);

        return Space.findAll({
            where: findSpaceWhere,
            include: [
                {
                    model: Category, as: 'type'
                },
                {
                    model: Role, as: 'roles',
                    include: [
                        {
                            model: User, as: 'users',
                            where: {
                                _id: query.userId,
                            },
                            through: {
                                where: {
                                    joinStatus: {
                                        $in: joinStatus
                                    }
                                }
                            }
                        },

                    ]
                },
                {
                    model: App, as: 'apps',
                    include: [
                        {
                            model: Category, as: 'type'
                        },
                        {
                            model: Nut, as: 'nuts',
                            include: [
                                {
                                    model: Category, as: 'type'
                                },
                                {
                                    model: PermitRole, as: 'permitRoles',
                                    where: {
                                        'owner': 'nut'
                                    },
                                    include: [
                                        {
                                            model: Permit, as: 'permit'
                                        },
                                        {
                                            model: Role, as: 'role',
                                            /*include: [
                                                {
                                                    model: User, as: 'users',
                                                    where: {
                                                        _id: query.userId
                                                    }
                                                }
                                            ]*/
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    model: UserRole, as: 'userRoles',
                    where: {
                        userId: query.userId
                    },
                    include: [
                        {
                            model: Role, as: 'role'
                        }
                    ]
                }
            ]
        }).then(function (spaces) {
            //console.log('spaces: ', JSON.stringify(spaces));
            return Promise.resolve(spaces);
        })
            .then(respondWithResult(res))
            .catch(handleError(res));
    }
}

/**
 * user join to space, by default, will add user as member role under space
 * @method module:server/api/space.method:userJoin
 * @param req.params.id {int} space id to join 
 * @param req.query.userId {int} userId to join
 * @returns {boolean} true -- created, otherwise error
 */
export function userJoin(req, res) {
    //console.log('req.body:',JSON.stringify(req.body));
    var spaceId = req.body.spaceId;
    var userId = req.body.userId;
    var joinStatus = 'applying';
    //  console.log("User " + userId + " request to join space " + spaceId);

    if (req.body.joinStatus) {
        var jStatus = req.body.joinStatus;
        if (['applying', 'following', 'joined'].includes(jStatus)) {
            joinStatus = jStatus;
        }
    }

    return Role.add({
        spaceId: spaceId,
        name: "member"
    }).then(function (role) {
        return UserRole.findOrCreate(
            {
                where: {
                    userId: userId,
                    roleId: role._id,
                    spaceId: spaceId
                },
                defaults: {
                    joinStatus: joinStatus
                }
            }
        ).spread(function (created, entity) {
            return Promise.resolve(entity);
        }).then(respondWithResult(res))
            .catch(handleError(res));
    })
}


/**
 * find user's joinable spaces'
 */
export function findAllJoinableSpace(req, res) {

    App.belongsTo(Category, { as: 'type' });

    UserRole.belongsTo(Space, { as: 'space' });
    Space.belongsTo(Category, { as: 'type' });
    //console.log(1);
    Space.hasMany(Role, { as: 'roles', foreignKey: 'spaceId' });
    //console.log(2);
    Role.belongsToMany(User, { through: 'UserRole', as: 'users' });
    //console.log(3);
    Space.hasMany(App, { as: 'apps' });
    //console.log(4);
    App.belongsTo(Category, { as: 'type' });
    //console.log(5);
    App.hasMany(Nut, { as: 'nuts' });
    Nut.belongsTo(Category, { as: 'type' });
    //console.log(6);
    Nut.hasMany(PermitRole, { foreignKey: 'ownerId', as: 'permitRoles' });
    //console.log(7);
    PermitRole.belongsTo(Permit, { as: 'permit' });
    //console.log(8);
    PermitRole.belongsTo(Role, { as: 'role' });

    var userId = req.query.userId || req.user._id;

    return Space.findAll(
        {
            include: [
                {
                    model: Role, as: 'roles',
                    include: [
                        {
                            model: User, as: 'users',
                            where: {
                                _id: userId
                            }
                        }
                    ]
                }
            ]
        }
    ).then(function (userSpaces) {
        //console.log('userSapces:',JSON.stringify(userSpaces));
        var idList = [];
        userSpaces.forEach(function (space) {
            idList.push(space._id);
        });
        //console.log('idList:', idList);
        return Space.findAll(
            {
                where: {
                    _id: {
                        $notIn: idList
                    }
                },
                include: [
                    {
                        model: Category, as: 'type'
                    },
                    {
                        model: Role, as: 'roles',
                    },
                    {
                        model: App, as: 'apps',
                        include: [
                            {
                                model: Category, as: 'type'
                            },
                            {
                                model: Nut, as: 'nuts',
                                include: [
                                    {
                                        model: PermitRole, as: 'permitRoles',
                                        include: [
                                            {
                                                model: Permit, as: 'permit'
                                            },
                                            {
                                                model: Role, as: 'role'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        )
    })
        .then(respondWithResult(res))
        .catch(handleError(res));
}

