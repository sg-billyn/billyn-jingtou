'use strict';

/**
 * Factory service to handle API request
 */
angular.module('localBusinessApp')
  .factory('Galleries', ['API', '$resource',
    function(API, $resource) {
      var API_ENDPOINT = API.url + API.endpoint.galleries;

      return $resource(API_ENDPOINT + ':id', {
        id: '@_id'
      });
    }
  ]);
