'use strict';

angular.module('localBusinessApp')
  .controller('MainCtrl', ['$scope', 'Auth',
    function($scope, Auth) {

      $scope.currentUser = Auth.getCurrentUser();
      $scope.isAdmin = Auth.isAdmin;

      $scope.date = new Date();

      $(window).trigger('resize');
    }
  ]);
