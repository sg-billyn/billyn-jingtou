'use strict';

angular.module('localBusinessApp')
  .config(function($stateProvider) {

    var states = {
      list: {
        url: '/clients',
        views: {
          '': {
            templateUrl: 'app/clients/clients.html'
          },
          'leftPane@clients': {
            templateUrl: 'app/clients/view-list.html',
            controller: 'ClientsListCtrl'
          }
        },
        authenticate: true
      },
      add: {
        views: {
          'rightPane@clients': {
            templateUrl: 'app/clients/form-add.html',
            controller: 'ClientsAddFormCtrl'
          }
        },
        authenticate: true
      },
      update: {
        url: '/:id/edit',
        views: {
          'rightPane@clients': {
            templateUrl: 'app/clients/form-update.html',
            controller: 'ClientsUpdateFormCtrl'
          }
        },
        authenticate: true
      },
      details: {
        url: '/:id',
        views: {
          'rightPane@clients': {
            templateUrl: 'app/clients/view-details.html',
            controller: 'ClientsDetailsCtrl'
          }
        },
        authenticate: true
      }
    };

    $stateProvider
      .state('clients', states.list)
      .state('clients.add', states.add)
      .state('clients.update', states.update)
      .state('clients.details', states.details);
  });
