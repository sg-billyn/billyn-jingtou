'use strict';

angular.module('localBusinessApp')
  .config(function($stateProvider) {
    var states = {
      list: {
        url: '/articles',
        views: {
          '': {
            templateUrl: 'app/articles/articles.html'
          },
          'leftPane@articles': {
            templateUrl: 'app/articles/view-list.html',
            controller: 'ArticlesListCtrl'
          }
        },
        authenticate: true
      },
      add: {
        views: {
          'rightPane@articles': {
            templateUrl: 'app/articles/form-add.html',
            controller: 'ArticlesAddFormCtrl'
          }
        },
        authenticate: true
      },
      update: {
        url: '/:id/edit',
        views: {
          'rightPane@articles': {
            templateUrl: 'app/articles/form-update.html',
            controller: 'ArticlesUpdateFormCtrl'
          }
        },
        authenticate: true
      },
      details: {
        url: '/:id',
        views: {
          'rightPane@articles': {
            templateUrl: 'app/articles/view-details.html',
            controller: 'ArticlesDetailsCtrl'
          }
        },
        authenticate: true
      }
    };

    $stateProvider
      .state('articles', states.list)
      .state('articles.add', states.add)
      .state('articles.update', states.update)
      .state('articles.details', states.details);
  });
