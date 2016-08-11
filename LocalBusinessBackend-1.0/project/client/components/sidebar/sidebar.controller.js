'use strict';

angular.module('localBusinessApp')
  .controller('SidebarCtrl', function($scope, $location, Auth, $translate) {
    $scope.currentUser = Auth.getCurrentUser();

    $scope.isAdmin = Auth.isAdmin;
    $scope.path = $location.path();

    var groups = [];

    groups['/']               = 'dashboard';
    groups['/articles']       = 'articles';
    groups['/reviews']        = 'restaurant';
    groups['/push']           = 'push';
    groups['/business']       = 'account';
    groups['/photos']         = 'account';
    groups['/contact']        = 'account';
    groups['/admin']          = 'admin';
    groups['/clients']        = 'clients';
    groups['/products']       = 'products';
    groups['/galleries']      = 'galleries';
    groups['/services']       = 'services';
    groups['/catalogs']       = 'catalogs';

    $scope.isItemActive = function(item){
      var basepath = $location.path().split('/')[1];
      return basepath === item;
    };

    $scope.isGroupActive = function(group){
      var basepath = '/' + $location.path().split('/')[1];
      return groups[basepath] === group;
    };

    /**
    * Listen to change language click event
    */
    $scope.onChangeLanguage = function (key) {
      $translate.use(key);
    };
  });
