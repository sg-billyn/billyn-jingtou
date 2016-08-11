'use strict';

angular.module('localBusinessApp')
  .controller('CreateCtrl', function($scope, Auth, User, Accounts, $location) {

    $scope.isCreate = true;
    $scope.submitLabel = 'Create';

    $scope.user = {};
    $scope.errors = {};

    $scope.datepick = {};

    $scope.datepick.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.datepick.format = $scope.datepick.formats[2];

    $scope.datepick.today = function() {
      $scope.datepick.dt = new Date();
    };

    $scope.datepick.today();

    // Disable weekend selection
    /*jshint unused: false */
    $scope.datepick.disabled = function(date, mode) {
      // return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
      return false;
    };
    /*jshint unused: true */

    $scope.datepick.toggleMin = function() {
      $scope.datepick.minDate = $scope.minDate ? null : new Date();
    };

    $scope.datepick.toggleMin();

    $scope.datepick.opened = false;

    $scope.datepick.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.datepick.opened = true;
    };

    $scope.datepick.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.register = function(form) {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.createUserByAdmin({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password
        })
          .then(function(response) {
            // Account created, redirect to admin
            // $location.path('/');
            console.log(response);
            var userId = response._id;

            Accounts.initialize(userId);

            $location.path('/admin');

          })
          .catch(function(err) {
            err = err.data;
            $scope.errors = {};

            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, function(error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.message;
            });
          });
      }
    };

    $(window).trigger('resize');
  });


  angular.module('localBusinessApp')
  .controller('EditCtrl', function($scope, Auth, User, Accounts, $location, $state, $stateParams) {

    $scope.isEdit = true;
    $scope.submitLabel = 'Update';

    var user = null;

    User.show({
      id: $stateParams.id,
    }).$promise.then(function(u){
      user = u;
      $scope.user = user;
    });

    Accounts.getForUser($stateParams.id)
      .then(function(response) {
        var body = response.data;
        if (body.result.length > 0){
          console.log('Accounts: %o', body.result);
          $scope.account = body.result[0];
        }
      });

    $scope.errors = {};

    $scope.datepick = {};

    $scope.datepick.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.datepick.format = $scope.datepick.formats[2];

    $scope.datepick.today = function() {
      $scope.datepick.dt = new Date();
    };

    $scope.datepick.today();

    // Disable weekend selection
    /*jshint unused: false */
    $scope.datepick.disabled = function(date, mode) {
      // return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
      return false;
    };
    /*jshint unused: true */

    $scope.datepick.toggleMin = function() {
      $scope.datepick.minDate = $scope.minDate ? null : new Date();
    };

    $scope.datepick.toggleMin();

    $scope.datepick.opened = false;

    $scope.datepick.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.datepick.opened = true;
    };

    $scope.datepick.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    function cancel(){
      $state.transitionTo('admin', {}, {
        reload: true
      });
    }

    $scope.register = function(form) {
      $scope.submitted = true;

      if (form.$valid) {
        /*jshint unused: false */
        user.$save(function(u,h){
          console.log(u);
          $scope.user = u;

          Accounts.update(user.result._id, $scope.account);
        });
        /*jshint unused: true */

        cancel();
      }
    };

    $scope.cancel = function(){
      cancel();
    };

    $scope.expiration = function(){
      $scope.datepick.opened = false;
    };

    $(window).trigger('resize');

  });
