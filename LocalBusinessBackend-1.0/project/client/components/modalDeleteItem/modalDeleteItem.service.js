'use strict';

angular.module('localBusinessApp')
  .controller('DeleteModalInstanceCtrl', [
    '$scope', '$modalInstance', 'modalData', '$log',
    function($scope, $modalInstance, modalData, $log) {

      $scope.ok = function() {
        $modalInstance.close();
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };

      $modalInstance.result.then(modalData.cb, function onFailed() {
        $log.info('Delete image is canceled');
      });
    }
  ]);

angular.module('localBusinessApp')
  .factory('modalDeleteItem', ['$modal', function($modal) {

    // Public API here
    return {
      // `record` to be deleted
      // `cb` callback function for delete logic
      open: function(cb) {
        $modal.open({
          templateUrl: 'components/modalDeleteItem/modal-delete.html',
          controller: 'DeleteModalInstanceCtrl',
          resolve: {
            // `modalData` will be injected to `DeleteModalInstanceCtrl`
            //  dependencies
            modalData: function() {
              return {
                cb: cb
              };
            }
          }
        });
      }
    };
  }]);