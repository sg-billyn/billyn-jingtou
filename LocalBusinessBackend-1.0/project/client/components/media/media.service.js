'use strict';

/**
 * Factory service to handle API request
 */
angular.module('localBusinessApp')
  .factory('Media', ['API', '$http',
    function(API, $http) {

      var API_ENDPOINT = API.url + API.endpoint.media;

      // Public APIs
      return {
        create: function(data) {
          return $http.post(API_ENDPOINT, data);
        },
        get: function(page) {
          return $http.get(API_ENDPOINT, {
            params: {
              page: page
            }
          });
        },
        update: function(id, data) {
          return $http.put(API_ENDPOINT + id, data);
        },
        findOne: function(id) {
          return $http.get(API_ENDPOINT + id);
        },
        delete: function(id) {
          return $http.delete(API_ENDPOINT + id);
        },
        deleteList: function(medias) {
          return $http({
            url: API_ENDPOINT,
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'DELETE',
            data: {
              medias: medias
            }
          });
        }
      };
    }
  ]);