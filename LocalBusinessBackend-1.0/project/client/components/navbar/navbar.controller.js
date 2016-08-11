'use strict';

angular.module('localBusinessApp')
  .controller('LogoutModalInstanceCtrl', [
    '$scope', '$modalInstance',
    function($scope, $modalInstance) {

      $scope.ok = function() {
        $modalInstance.close();
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };

    }
  ]);


angular.module('localBusinessApp')
  .controller('NavbarCtrl', function($scope, $location, $modal, $log, Auth) {
    // $scope.menu = [{
    //   'title': 'Home',
    //   'link': '/',
    //   'fa': 'fa-home'
    // }];

    $scope.menu = [];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    // console.log($scope.isLoggedIn);

    // $scope.logout = function() {
    //   Auth.logout();
    //   $location.path('/login');
    // };

    $scope.logout = function() {

      var modalInstance = $modal.open({
        templateUrl: 'components/navbar/modal-logout.html',
        controller: 'LogoutModalInstanceCtrl',
        resolve: {

        }
      });

      modalInstance.result.then(
        function() {
          Auth.logout();
          $location.path('/login');
        },
        function() {
          $log.info('Logout is aborted.');
        });

    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };

  });
