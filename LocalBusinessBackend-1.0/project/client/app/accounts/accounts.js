'use strict';

angular.module('localBusinessApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('business', {
        url: '/business',
        templateUrl: 'app/accounts/business.html',
        controller: 'AccountsBusinessCtrl'
      })
      .state('photos', {
        url: '/photos',
        templateUrl: 'app/accounts/photos.html',
        controller: 'AccountsPhotoCtrl'
      })
      .state('contact', {
        url: '/contact',
        templateUrl: 'app/accounts/contact.html',
        controller: 'AccountsContactCtrl'
      });
  });
