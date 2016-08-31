'use strict';

(function () {

    function BUserService($resource, User, $q, Util, $rootScope) {
        var safeCb = Util.safeCb;
        var resUser = $resource('/api/apps/:id/:controller', {
            id: '@_id'
        }, {
                update: {
                    method: 'PUT'
                },
                joinSpace: {
                    method: 'POST',
                    params: {
                        controller: 'joinSpace'
                    }
                },
                addType: {
                    method: 'POST',
                    params: {
                        controller: 'addType'
                    }
                },
                findOrCreate: {
                    method: 'POST',
                    params: {
                        controller: 'findOrCreate'
                    }
                }
            });

        var resUserProfile = $resource('/api/user/profiles/:id/:controller', {
            id: '@_id'
        }, {
                bulkAdd: {
                    method: 'POST',
                    isArray: true,
                    params: {
                        id: 'bulk'
                    }
                }
            });

        var resUserGroup = $resource('/api/users/groups/:id/:controller', {
            id: '@_id'
        }, {
                add: {
                    method: 'POST'
                },
                findOne: {
                    method: 'GET'
                },
                findAll: {
                    method: 'GET',
                    isArray: true
                },
                findRoles: {
                    method: 'GET',
                    isArray: true,
                    params: {
                        id: 'roles'
                    }
                },
                addRole: {
                    method: 'POST',
                    params: {
                        id: 'roles'
                    }
                }
            });

        var currentUser = {};

        var service = {};

        service.setCurrent = function (user) {
            return currentUser = user;
        }

        service.current = function (callback) {
            if (arguments.length === 0) {
                return currentUser;
            }
            var value = (currentUser.hasOwnProperty('$promise')) ?
                currentUser.$promise : currentUser;
            return $q.when(value)
                .then(user => {
                    safeCb(callback)(user);
                    return user;
                }, () => {
                    safeCb(callback)({});
                    return {};
                })
        }

        service.getUserProfiles = function (findContext) {
            return resUserProfile.get(findContext).$promise;
        }

        service.bulkAddUserProfile = function (bulkData, context) {
            context = context || {};
            if (!context.hasOwnProperty('spaceId')) {
                context.spaceId = $rootScope.current.space._id;
            }
            context.data = bulkData;
            return resUserProfile.bulkAdd(context).$promise;
        }

        service.addGroup = function (data) {
            if (!data.spaceId) {
                data.spaceId = $rootScope.current.space._id;
            }
            return resUserGroup.add(data).$promise;
        }

        service.findOneUserGroup = function (data) {
            return resUserGroup.findOne(data).$promise;
        }

        service.findAllUserGroup = function (data) {
            return resUserGroup.findAll(data).$promise;
        }

        service.findUserGroupRoles = function(data){

            if(angular.isObject(data)){
                var userGroupId;
                for(var key in data){
                    if(key.toLocaleLowerCase() === 'usergroupid'){
                        userGroupId = data[key];
                    }
                }
                if(userGroupId){
                    return resUserGroup.findRoles(
                        {
                            userGroupId: userGroupId
                        }
                    ).$promise;
                }else{
                    return $q.reject('fail to find group roles');
                }
            }
        }

        service.addUserGroupRole = function(data){
            var roleId, userGroupId;

            if(angular.isObject(data)){
                for(var key in data){
                    if(key.toLocaleLowerCase() === 'roleid'){
                        roleId = data[key];
                    }
                    if(key.toLocaleLowerCase() === 'usergroupid'){
                        userGroupId = data[key];
                    }
                    if(key.toLocaleLowerCase() === 'groupid'){
                        userGroupId = data[key];
                    }
                }
            }

            if(roleId && userGroupId){
                return resUserGroup.addRole({
                    roleId: roleId,
                    userGroupId: userGroupId
                }).$promise;
            } else {
                return $q.reject('fail to add role');
            }
        }

        return service;
    }

    angular.module('billynApp.core')
        .factory('BUser', BUserService);

})();

