'use strict';

angular.module('localBusinessApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('push', {
        url: '/push',
        templateUrl: 'app/push/push.html',
        controller: 'PushCtrl'
      });
  });