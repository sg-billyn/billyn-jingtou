'use strict';

(function () {

    class ListMessageController {
        constructor($q, Auth, BSpace, BApp, BNut) {
            // Use the User $resource to fetch all users
            //this.users = User.query();

            var ctrl = this;
            this.recommends = [1, 2, 3, 4, 5];

            // todo 查询指定user下的spaces数据
            var user = Auth.getCurrentUser();
            this.currentUser = user;
            this.BSpace = BSpace;
            //应该使用getUserSpaces这个函数去获取数据
            ctrl.BSpace.getUserSpaces(user._id).then(function (spaces) {
                ctrl.spaces = spaces;
                angular.forEach(spaces, function (space) {
                    $q.when(BApp.findAppsByUser(space._id)).then(function (apps) {
                        space.apps = [];
                        for (var key in apps) {
                            space.apps.push(apps[key]);
                        }
                    });
                    /*
                    angular.forEach(space.apps, function(app) {
                        $q.when(BNut.findNuts({ spaceId: space._id, appId: app._id })).then(function(nuts) {
                            app.nuts = nuts;
                        });
                    });*/
                });
            }, function (error) {
                console.log('error', error);
            });

            this.currentSpace = {
                _id: '', name: '', desc: ''
            };
        }

        exitSpace() {
            alert("exit space: " + this.currentSpace._id);
        }
    }

    class CreateSpaceController {

        constructor($state, BSpace) {

            //layoutService.breadcrumbs.push({state:'user.createSpace', text:'创建机构'});

            // 暂存依赖
            this.$state = $state;
            this.BSpace = BSpace;
            this.creating = false;

            this.space = {
                name: '', alias: '', type: 'normal'
            };
            // todo 获取 space type
            //this.spaceTypes = BSpace.getTypeSpaces();
            /*
            this.spaceTypes = [
                { id: '1', alias: '通用机构' },
                { id: '2', alias: '商用机构' },
                { id: '3', alias: '公共机构' },
                { id: '4', alias: '非盈利机构' }
            ];*/

            var that = this;
            BSpace.getConfig().then(function (config) {
                that.spaceTypes = config.types;
            })
        }

        createSpace(form) {
            if (form.$valid) {
                this.creating = true;
                // 暂存this对象
                var ctrl = this;
                // 将space数据，写进数据库！
                this.BSpace.create(this.space).then(function (res) {
                    ctrl.$state.go('pc.dashboard', null, { reload: 'pc' });
                }, function (err) {
                    this.creating = false;
                    console.log('err:', err);
                });
            }
        }
    }

    class JoinSpaceController {

        constructor(BSpace, BRole, $state, Auth, toaster, $rootScope) {
            //console.log(BSpace);
            this.$rootScope = $rootScope;
            this.BSpace = BSpace;
            this.BRole = BRole;
            this.$state = $state;
            this.Auth = Auth;
            this.toaster = toaster;
            this.joinSpaces = {};
            var ctrl = this;
            this.action = {};

            this.user = Auth.getCurrentUser();

            this.loadJoinableSpaces(this.user);
            this.loadFollowingSpaces(this.user);

        }

        joinSpace(space) {
            this.action.name = this.action.name === 'joinSpace' + space._id ? this.action = {} : 'joinSpace' + space._id;
        }

        followSpace(space) {
            this.action.name = this.action.name === 'followSpace' + space._id ? this.action = {} : 'followSpace' + space._id;
        }

        cancelUserRole(userRole) {
            this.action.name = this.action.name === 'cancelUserRole' + userRole._id ? this.action = {} : 'cancelUserRole' + userRole._id;
        }

        confirmAction(action, space) {
            var that = this;
            var user = this.Auth.getCurrentUser();
            var joinStatus;
            if (action === 'joinSpace') {
                joinStatus = 'applying';
            }
            if (action === 'followSpace') {
                joinStatus = 'following';
            }
            //if (action === 'joinSpace') {
            this.BSpace.userJoin(space._id, user._id, joinStatus).then(function (data) {

                // console.log("join space result: " + data);
                if (data.$resolved === true) {
                    that.toaster.success("Join space success.");
                    that.loadJoinableSpaces();
                    that.loadFollowingSpaces();
                    that.action = {};
                    //ctrl.$state.go('pc.joinSpace', null, { reload: 'pc' });
                    /*
                    angular.element('#myModal').on('hidden.bs.modal', function () {
                        ctrl.$state.go('pc.joinSpace', null, { reload: true });
                    });*/
                }
                else
                    that.toaster.error("Join space failed.");
            });
            //}
        }

        confirmCancel(userRole) {
            var that = this;
            that.BRole.deleteUserRole(userRole._id).then(function (result) {
                that.loadJoinableSpaces();
                that.loadFollowingSpaces();
                that.action = {};
            })
        }

        loadJoinableSpaces(user) {
            user = user || this.Auth.getCurrentUser();
            var that = this;
            that.BSpace.findAllJoinableSpace(user).then(function (spaces) {
                that.joinableSpaces = spaces;
            })
        }

        loadFollowingSpaces(user) {
            user = user || this.Auth.getCurrentUser();
            var that = this;
            that.BSpace.findAllFollowingSpace(user).then(function (spaces) {
                that.followingSpaces = spaces;
            });
            that.BRole.findAllUserRole(
                {
                    userId: user._id,
                    joinStatus: ['applying', 'following']
                }
            ).then(function (userRoleCollection) {
                that.userRoleCollection = userRoleCollection;
            })
        }

    }

    angular.module('billynApp.core')
        .controller('ListMessageController', ListMessageController)
        .controller('CreateSpaceController', CreateSpaceController)
        .controller('JoinSpaceController', JoinSpaceController);

})();
