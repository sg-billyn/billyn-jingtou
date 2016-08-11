'use strict';

angular.module('localBusinessApp')
  .config(function($stateProvider) {

    var states = {
      list: {
        url: '/pages',
        views: {
          '': {
            templateUrl: 'app/pages/pages.html'
          },
          'leftPane@pages': {
            templateUrl: 'app/pages/view-list.html',
            controller: 'PagesListCtrl'
          }
        },
        authenticate: true
      },
      add: {
        views: {
          'rightPane@pages': {
            templateUrl: 'app/pages/form-add.html',
            controller: 'PagesAddFormCtrl'
          }
        },
        authenticate: true
      },
      update: {
        url: '/:id/edit',
        views: {
          'rightPane@pages': {
            templateUrl: 'app/pages/form-update.html',
            controller: 'PagesUpdateFormCtrl'
          }
        },
        authenticate: true
      },
      details: {
        url: '/:id',
        views: {
          'rightPane@pages': {
            templateUrl: 'app/pages/view-details.html',
            controller: 'PagesDetailsCtrl'
          }
        },
        authenticate: true
      }
    };

    $stateProvider
      .state('pages', states.list)
      .state('pages.add', states.add)
      .state('pages.update', states.update)
      .state('pages.details', states.details);
  });