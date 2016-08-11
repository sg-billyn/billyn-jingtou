'use strict';

angular.module('localBusinessApp')
  .config(function($stateProvider) {

    var states = {
      list: {
        url: '/services',
        views: {
          '': {
            templateUrl: 'app/services/services.html'
          },
          'leftPane@services': {
            templateUrl: 'app/services/view-list.html',
            controller: 'ServicesListCtrl'
          }
        },
        authenticate: true
      },
      add: {
        views: {
          'rightPane@services': {
            templateUrl: 'app/services/form-add.html',
            controller: 'ServicesAddFormCtrl'
          }
        },
        authenticate: true
      },
      update: {
        url: '/:id/edit',
        views: {
          'rightPane@services': {
            templateUrl: 'app/services/form-update.html',
            controller: 'ServicesUpdateFormCtrl'
          }
        },
        authenticate: true
      },
      details: {
        url: '/:id',
        views: {
          'rightPane@services': {
            templateUrl: 'app/services/view-details.html',
            controller: 'ServicesDetailsCtrl'
          }
        },
        authenticate: true
      }
    };

    $stateProvider
      .state('services', states.list)
      .state('services.add', states.add)
      .state('services.update', states.update)
      .state('services.details', states.details);
  });
