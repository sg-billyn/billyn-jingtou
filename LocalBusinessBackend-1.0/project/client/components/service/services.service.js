'use strict';

/**
 * Factory service to handle API request
 */
angular.module('localBusinessApp')
  .factory('Services', ['API', '$resource',
    function(API, $resource) {
      var API_ENDPOINT = API.url + API.endpoint.services;

      return $resource(API_ENDPOINT + ':id', {
        id: '@_id'
      });
    }
  ]);
