'use strict';

module.exports = function (sequelize, DataTypes) {
    var UserProfile = sequelize.define('UserGroup', {

        _id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        spaceId: {
            type: DataTypes.INTEGER,
            default: -100 // for all space
        },
        circleId: {
            type: DataTypes.INTEGER,
            default: -100 // for all circle
        },
        parentId: {
            type: DataTypes.INTEGER,
            default: -1 // for no parent
        },
        name: DataTypes.STRING,
        fullname: DataTypes.STRING,
        alias: DataTypes.STRING,
        description: DataTypes.STRING,
        active: DataTypes.BOOLEAN
    }, {

            /**
             * Virtual Getters
             */
            getterMethods: {
            },

            classMethods: {
                add: function (data) {
                    var whereData = {};
                    var defaultData = {};
                    for (var key in data) {
                        if (key.toLocaleLowerCase() === 'name') {
                            whereData.name = data[key]
                        }
                        if (key.toLocaleLowerCase() === 'spaceid') {
                            whereData.spaceId = data[key]
                        }
                        if (key.toLocaleLowerCase() === 'alias') {
                            whereData.alias = data[key]
                        }
                        if (key.toLocaleLowerCase() === 'description') {
                            whereData.description = data[key]
                        }
                    }
                    if (whereData.name && whereData.spaceId) {
                        return this.findOrCreate(
                            {
                                where: whereData,
                                defaults: defaultData
                            }
                        ).spread(function (entity, created) {
                            return Promise.resolve(entity);
                        })
                    } else {
                        return Promise.reject('please check input!');
                    }
                },
                findAllByQuery: function (query) {
                    var findQuery = {};
                    for (var key in query) {
                        if (key.toLocaleLowerCase() === 'spaceid') {
                            findQuery.spaceId = query[key];
                        }
                    }

                    if (findQuery.spaceId) {
                        return this.findAll(
                            {
                                where: findQuery
                            }
                        )
                    } else {
                        Promise.reject('must provide spaceId!');
                    }
                },
                findOneByQuery: function (query) {
                    var error = true;

                    if (!isNaN(query) && query > 0) {
                        error = false;
                        return this.findOne(
                            {
                                where: {
                                    _id: query
                                }
                            }
                        )
                    }

                    if (typeof query === 'object') {

                        var findQuery = {};
                        for (var key in query) {
                            if (key.toLocaleLowerCase() === 'id') {
                                findQuery._id = query[key];
                            } else {
                                if (key.toLocaleLowerCase() === 'spaceid') {
                                    findQuery.spaceId = query[key];
                                }
                                if (key.toLocaleLowerCase() === 'name') {
                                    findQuery.name = query[key];
                                }
                            }
                        }

                        if (findQuery._id || (findQuery.spaceId && findQuery.name)) {
                            error = false;
                            return this.findOne(
                                {
                                    where: findQuery
                                }
                            )
                        }
                    }

                    if (error) {
                        return Promise.reject('fail to find one!');
                    }
                }
            },

            /**
             * Pre-save hooks
             */
            hooks: {
            },

            /**
             * Instance Methods
             */
            instanceMethods: {

            }
        });

    return UserProfile;
};
