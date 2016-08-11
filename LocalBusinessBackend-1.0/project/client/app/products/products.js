'use strict';

angular.module('localBusinessApp')
  .config(function($stateProvider) {

    var states = {
      list: {
        url: '/products',
        views: {
          '': {
            templateUrl: 'app/products/products.html'
          },
          'leftPane@products': {
            templateUrl: 'app/products/view-list.html',
            controller: 'ProductsListCtrl'
          }
        },
        authenticate: true
      },
      add: {
        views: {
          'rightPane@products': {
            templateUrl: 'app/products/form-add.html',
            controller: 'ProductsAddFormCtrl'
          }
        },
        authenticate: true
      },
      update: {
        url: '/:id/edit',
        views: {
          'rightPane@products': {
            templateUrl: 'app/products/form-update.html',
            controller: 'ProductsUpdateFormCtrl'
          }
        },
        authenticate: true
      },
      details: {
        url: '/:id',
        views: {
          'rightPane@products': {
            templateUrl: 'app/products/view-details.html',
            controller: 'ProductsDetailsCtrl'
          }
        },
        authenticate: true
      }
    };

    $stateProvider
      .state('products', states.list)
      .state('products.add', states.add)
      .state('products.update', states.update)
      .state('products.details', states.details);
  });
