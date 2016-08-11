'use strict';

angular.module('localBusinessApp')
  .controller('ClientsListCtrl', ['$scope', '$rootScope', '$http',
    '$location', 'Clients',
    function($scope, $rootScope, $http, $location, Clients) {
      $scope.data = {
        records: []
      };

      // fetch the records
      Clients
        .get()
        .$promise
        .then(function(response) {
          $scope.data.records = response.result;
        });

      // listen to hide records list update event
      var listUpdatedListener = $rootScope.$on('list_updated',
        function() {
          Clients
            .get()
            .$promise
            .then(function(response) {
              $scope.data.records = response.result;
            });
        });

      // unregister the listener to avoid memory leak
      $scope.$on('$destroy', listUpdatedListener);

      $(window).trigger('resize');
    }
  ]);

angular.module('localBusinessApp')
  .controller('ClientsAddFormCtrl', ['$scope', 'Clients', '$log', '$timeout',
    '$state',
    function($scope, Clients, $log, $timeout, $state) {

      $scope.data = {
        // The model the contols are binded to.
        // Its fields are coresponding to our record fields
        model: {}
      };

      $scope.ui = {};
      $scope.ui.progress = 0;
      $scope.ui.inProgress = false;

      /*jshint unused: false */
      function progressStart() {
        $scope.ui.inProgress = true;
      }

      function progressEnd() {
          $scope.ui.inProgress = false;
        }
        /*jshint unused: true */

      /*
       * Handle the add form submission
       */
      $scope.save = function() {
        // if the form is not valid then cut the flow
        if (!$scope.addForm.$valid) {
          return;
        }

        progressStart();

        var data = {
          name: $scope.data.model.name,
          clientId: $scope.data.model.clientId,
          clientSecret: $scope.data.model.clientSecret
        };

        Clients
          .save(data)
          .$promise
          .then(function onSuccess() {
            // notify the listener when the client is added
            $scope.$emit('list_updated');

            $state.transitionTo($state.current, {}, {
              reload: true
            });
          })
          .catch(function(error) {
            $log.error('failed to add record');
          });
      };

      $scope.generateKeys = function() {
        Clients.generateKeys()
          .$promise
          .then(function(response) {
            $scope.credentials = response.result;
            $scope.data.model.clientId = $scope.credentials.clientId;
            $scope.data.model.clientSecret = $scope.credentials.clientSecret;
          })
          .catch(function(error) {
            $log.error('failed to get the credentials');
          });
      };
    }
  ]);

angular.module('localBusinessApp')
  .controller('ClientsUpdateFormCtrl', [
    '$scope', '$rootScope', 'Clients', '$log', '$stateParams', '$state',
    function($scope, $rootScope, Clients, $log, $stateParams, $state) {

      $scope.data = {
        // The model the controllers are binded to.
        // Its fields are coresponding to our record fields
        model: {}
      };

      $scope.ui = {};
      $scope.ui.progress = 0;
      $scope.ui.inProgress = false;

      function progressStart() {
        $scope.ui.inProgress = true;
      }

      function progressEnd() {
        $scope.ui.inProgress = false;
      }

      // fetch single document
      Clients
        .get({
          id: $stateParams.id
        })
        .$promise
        .then(function(response) {
          $scope.data.model = response;
        })
        .catch(function(error) {
          $log.error('failed to fetch record', error);
        });

      /*
       * Handle the form submission
       */
      $scope.update = function() {
        // if the form is not valid then cut the flow
        if (!$scope.updateForm.$valid) {
          return;
        }

        progressStart();

        $scope.data.model.$save(
          function onSuccess(response) {
            // notify the listener when the record is added
            $scope.$emit('list_updated');
            // display the updated form
            $state.transitionTo('clients.details', {id:response._id}, {
              reload: true
            });
          },
          function onError(error) {
            $log.error('failed to save record', error);
            progressEnd();
          });

      };

      $scope.generateKeys = function() {
        Clients.generateKeys()
          .$promise
          .then(function(response) {
            $scope.credentials = response.result;
            $scope.data.model.clientId = $scope.credentials.clientId;
            $scope.data.model.clientSecret = $scope.credentials.clientSecret;
          })
          .catch(function(error) {
            $log.error('failed to get the credentials', error);
          });
      };
    }
  ]);

angular.module('localBusinessApp')
  .controller('ClientsItemCtrl', ['$scope', '$log', 'modalDeleteItem',
    'Clients', '$state',
    function($scope, $log, modalDeleteItem, Clients, $state) {

      /**
       * Delete client item from the list
       */
      $scope.deleteItem = function(client) {
        modalDeleteItem.open(function() {

          // delete the record
          Clients
            .delete({
              id: client._id
            })
            .$promise
            .then(function onSuccess() {
              // reload the pages list view
              $state.transitionTo('clients', {}, {
                reload: true
              });
            })
            .catch(function(error) {
              $log.error('An error occured while deleting record ', error);
            });

        });
      };
    }
  ]);

angular.module('localBusinessApp')
  .controller('ClientsDetailsCtrl', ['$scope', '$stateParams', 'Clients',
    function($scope, $stateParams, Clients) {
      // hold the details data
      $scope.data = {
        model: {}
      };

      // fetch single client
      Clients
        .get({
          id: $stateParams.id
        })
        .$promise
        .then(function(response) {
          $scope.data.model = response;
        });
    }
  ]);
