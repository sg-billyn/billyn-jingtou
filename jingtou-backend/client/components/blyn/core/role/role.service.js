'use strict';

(function () {

	function RoleService($resource, User, $q, Util, $rootScope) {
		var safeCb = Util.safeCb;

		var resRole = $resource('/api/roles/:id/:controller', {
			id: '@_id'
		}, {
				find: {
					method: 'GET',
					params: {
						id: 'find'
					}
				},
				addGrants: {
					method: 'POST',
					isArray: true,
					params: {
						id: 'grants'
					}
				},
				findGrants: {
					method: 'GET',
					isArray: true,
					params: {
						id: 'grants'
					}
				},
				findAllUserRole: {
					method: 'GET',
					isArray: true,
					params: {
						id: 'users'
					}
				}
			});

		var resUserRole = $resource('/api/roles/users/:id/:controller', {
			id: '@_id'
		}, {
				update: {
					method: 'put'
				}
			});
		
		var currentRole = {};

		var service = {};

		service.find = function (roleData) {

			if (angular.isNumber(roleData) && roleData > 0) {
				return resRole.get({
					id: roleData
				});
			}

			if (angular.isString(roleData)) {
				roleData = {
					name: roleData
				};
			}

			if (typeof roleData === 'object') {
				if (!roleData.hasOwnProperty('spaceId')) {
					roleData.spaceId = $rootScope.current.space._id;
				}

				return resRole.find(roleData);
			}

			//otherwise return error
			//return $q.reject('fail to find role');
		}

		service.findById = function (roleId) {
			return resRole.get({
				id: roleId
			}).$promise;
		}

		service.findAll = function (roleData) {
			if (angular.isString(roleData)) {
				roleData = {
					name: roleData
				};
			}

			if (typeof roleData === 'object') {
				if (!roleData.hasOwnProperty('spaceId')) {
					roleData.spaceId = $rootScope.current.space.id;
				}

				return resRole.query(roleData);
			}

			//otherwise return error
			$q.reject('fail to find roles');
		}

		service.create = function (roleData) {
			return this.addRole(roleData);
		}

		//add role into space
		//
		service.addRole = function (roleData) {

			if (angular.isString(roleData)) {
				roleData = {
					name: roleData
				};
			}

			if (typeof roleData === 'object') {

				if (!roleData.hasOwnProperty('spaceId')) {
					roleData.spaceId = $rootScope.current.space._id;//BSpace.current()._id;
				}
				return resRole.save(roleData).$promise;
			}
		}

		service.deleteRole = function (roleId) {

			var res = $resource('/api/roles/:id');

			return res.delete({ id: roleId }).$promise;

		}

		service.addUserRole = function (roleData) {
			// console.log('roleData:',roleData);
			//  var saveRes =  resRole.save({id:'user'},roleData);
			// console.log('saveRes',saveRes);

			var saveRes = $resource('/api/roles/user/');
			return saveRes.save(roleData).$promise;
		}

		service.addUserRoleBatch = function (roleData) {
			var saveRes = $resource('/api/roles/users/batch',
				null,
				{ save: { method: 'post', isArray: true } });

			return saveRes.save(roleData).$promise;
		}


		service.deleteUserRole = function (roleData) {

			var userRoleId;
			if (angular.isObject(roleData)) {
				userRoleId = roleData._id;
			}

			if (!isNaN(roleData)) {
				userRoleId = roleData;
			}

			return resUserRole.delete(
				{
					id: userRoleId
				}
			).$promise;

		}

		service.getSpaceRoles = function (spaceId) {

            var spaceRoles = $resource('/api/roles?spaceId=:id', { id: '@_id' });
            return spaceRoles.query({ id: spaceId }).$promise;

		}

       	service.addChild = function (parentId, roleData) {

            var spaceRoles = $resource('/api/roles/:id', { id: '@_id' });
            return spaceRoles.save({ id: parentId }, roleData).$promise;

		}

		service.getAllUserRoleInSpace = function (userId, spaceId) {

			if (!userId) {
				userId = $rootScope.current.user._id;
			}

			if (!spaceId) {
				spaceId = $rootScope.current.space._id;
			}

			return this.findAllUserRole({ userId: userId, spaceId: spaceId });
		}

		service.addGrants = function (grantsData, ownerData) {

			return resRole.addGrants({
				grants: grantsData,
				ownerData: ownerData
			}).$promise;
		}

		//this function return all grants
		service.findAllGrant = function (role, ownerData) {
			resRole.findAllGrants(
				{
					roleId: role._id,
					ownerData: ownerData
				}
			).$promise;
		}

		//find all userRoles
		service.findAllUserRole = function (findContext) {
			return resRole.findAllUserRole(findContext).$promise;
		}

		service.updateUserRole = function (data) {
			return resUserRole.update(data).$promise;
		}

		service.userHasRole = function (roleData) {

			var hasRole = false;

			var userRoles = $rootScope.current.userSpace.userRoles;

			if (angular.isString(roleData)) {
				if (parseInt(roleData) && parseInt(roleData) > 0) {
					var roleId = parseInt(roleData);
					userRoles.forEach(function (userRole) {
						if (userRole.role._id === roleId) {
							hasRole = true;
						}
					})
				} else {
					var roleName = roleData;
					userRoles.forEach(function (userRole) {
						if (userRole.role.fullname === 'root.role.' + roleName) {
							hasRole = true;
						}
					})
				}
			}

			if (angular.isObject(roleData)) {
				userRoles.forEach(function (userRole) {
					if (userRole.role._id === roleData._id) {
						hasRole = true;
					}
				})
			}
			return hasRole;
		}

		return service;
	}

	angular.module('billynApp.core')
		.factory('BRole', RoleService);

})();
