'use strict';

angular.module('localBusinessApp')
.config(function($stateProvider) {

  var states = {
    list: {
      url: '/reviews',
      views: {
        '': {
          templateUrl: 'app/reviews/reviews.html'
        },
        'leftPane@reviews': {
          templateUrl: 'app/reviews/view-list.html',
          controller: 'ReviewsListCtrl'
        }
      },
      authenticate: true
    },
    add: {
      views: {
        'rightPane@reviews': {
          templateUrl: 'app/reviews/form-add.html',
          controller: 'ReviewsAddFormCtrl'
        }
      },
      authenticate: true
    },
    update: {
      url: '/:id/edit',
      views: {
        'rightPane@reviews': {
          templateUrl: 'app/reviews/form-update.html',
          controller: 'ReviewsUpdateFormCtrl'
        }
      },
      authenticate: true
    },
    details: {
      url: '/:id',
      views: {
        'rightPane@reviews': {
          templateUrl: 'app/reviews/view-details.html',
          controller: 'ReviewsDetailsCtrl'
        }
      },
      authenticate: true
    }
  };

  $stateProvider
  .state('reviews', states.list)
  .state('reviews.add', states.add)
  .state('reviews.update', states.update)
  .state('reviews.details', states.details);
});
