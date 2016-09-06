angular.module('starter')

.controller('LoginCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.user = {
    loginId:'',
    password: ''
  };

  $scope.login = function() {
    AuthService.login($scope.user).then(function(data) {
      $state.go('myspaces');

    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: errMsg
      });
    });
  };
})
