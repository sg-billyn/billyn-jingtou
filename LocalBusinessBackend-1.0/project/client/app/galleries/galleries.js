'use strict';

angular.module('localBusinessApp')
  .config(function($stateProvider) {

    var states = {
      list: {
        url: '/galleries',
        views: {
          '': {
            templateUrl: 'app/galleries/galleries.html'
          },
          'leftPane@galleries': {
            templateUrl: 'app/galleries/view-list.html',
            controller: 'GalleriesListCtrl'
          }
        },
        authenticate: true
      },
      add: {
        views: {
          'rightPane@galleries': {
            templateUrl: 'app/galleries/form-add.html',
            controller: 'GalleriesAddFormCtrl'
          }
        },
        authenticate: true
      },
      update: {
        url: '/:id/edit',
        views: {
          'rightPane@galleries': {
            templateUrl: 'app/galleries/form-update.html',
            controller: 'GalleriesUpdateFormCtrl'
          }
        },
        authenticate: true
      },
      details: {
        url: '/:id',
        views: {
          'rightPane@galleries': {
            templateUrl: 'app/galleries/view-details.html',
            controller: 'GalleriesDetailsCtrl'
          }
        },
        authenticate: true
      }
    };

    $stateProvider
      .state('galleries', states.list)
      .state('galleries.add', states.add)
      .state('galleries.update', states.update)
      .state('galleries.details', states.details);
  });
