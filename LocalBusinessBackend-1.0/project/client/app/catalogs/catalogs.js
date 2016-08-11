'use strict';

angular.module('localBusinessApp')
  .config(function($stateProvider) {

    var states = {
      list: {
        url: '/catalogs',
        views: {
          '': {
            templateUrl: 'app/catalogs/catalogs.html'
          },
          'leftPane@catalogs': {
            templateUrl: 'app/catalogs/view-list.html',
            controller: 'CatalogsListCtrl'
          }
        },
        authenticate: true
      },
      add: {
        views: {
          'rightPane@catalogs': {
            templateUrl: 'app/catalogs/form-add.html',
            controller: 'CatalogsAddFormCtrl'
          }
        },
        authenticate: true
      },
      update: {
        url: '/:id/edit',
        views: {
          'rightPane@catalogs': {
            templateUrl: 'app/catalogs/form-update.html',
            controller: 'CatalogsUpdateFormCtrl'
          }
        },
        authenticate: true
      },
      details: {
        url: '/:id',
        views: {
          'rightPane@catalogs': {
            templateUrl: 'app/catalogs/view-details.html',
            controller: 'CatalogsDetailsCtrl'
          }
        },
        authenticate: true
      }
    };

    $stateProvider
      .state('catalogs', states.list)
      .state('catalogs.add', states.add)
      .state('catalogs.update', states.update)
      .state('catalogs.details', states.details);
  });
