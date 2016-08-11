'use strict';

/**
* Factory service to handle API request
*/
angular.module('localBusinessApp')
  .service('Reviews', ['API', '$http',
    function(API, $http) {

      var API_ENDPOINT = API.url + API.endpoint.reviews;

      // Public API here
      return {
        create: function(data) {
          return $http.post(API_ENDPOINT, data);
        },
        update: function(id, data) {
          return $http.put(API_ENDPOINT + id, data);
        },
        get: function(page) {
          return $http.get(API_ENDPOINT, {
            params: {
              page: page
            }
          });
        },
        findOne: function(id) {
          return $http.get(API_ENDPOINT + id);
        },
        delete: function(id) {
          return $http.delete(API_ENDPOINT + id);
        }
      };

    }
  ]);
