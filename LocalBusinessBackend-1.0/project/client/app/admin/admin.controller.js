'use strict';

angular.module('localBusinessApp')
  .controller('AdminDeleteModalInstanceCtrl', [
    '$scope', '$modalInstance', '$log', 'user',
    function($scope, $modalInstance, $log, user) {

      $scope.user = user;

      $scope.ok = function() {
        $modalInstance.close();
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };

    }
  ]);


angular.module('localBusinessApp')
  .controller('AdminCtrl', function($scope, $http, $log, $modal, Auth, User) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[2];

    $scope.today = function() {
      $scope.dt = new Date();
    };
    $scope.today();

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.opened = [];

    $scope.open = function(index, $event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened[index] = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    // $scope.delete = function(user) {
    //   User.remove({
    //     id: user._id
    //   });
    //   angular.forEach($scope.users, function(u, i) {
    //     if (u === user) {
    //       $scope.users.splice(i, 1);
    //     }
    //   });
    // };

    /**
     * Delete item from the list
     */
    $scope.delete = function(user) {

      var modalInstance = $modal.open({
        templateUrl: 'app/admin/modal-delete.html',
        controller: 'AdminDeleteModalInstanceCtrl',
        resolve: {
          user: function() {
            return user;
          }
        }
      });

      modalInstance.result.then(
        function() {
          User.remove({
            id: user._id
          });
          angular.forEach($scope.users, function(u, i) {
            if (u === user) {
              $scope.users.splice(i, 1);
            }
          });
        },
        function() {
          $log.info('Delete user is aborted.');
        });

    };

    $(window).trigger('resize');
  });
