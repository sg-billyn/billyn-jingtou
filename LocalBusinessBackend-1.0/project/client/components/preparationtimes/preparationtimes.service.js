'use strict';

/**
 * Factory service to handle API request
 */
angular.module('localBusinessApp')
  .factory('PreparationTimes', [
    function() {

      var times = [
        {
          name: 'Pizzas ~15min',
          value: 15,
        },
        {
          name: 'Salads ~8min',
          value: 8,
        },
        {
          name: 'Pastas ~18min',
          value: 18,
        }
      ];

      // Public API here
      return {
        get: function() {
          return times;
        }
      };
    }
  ]);
