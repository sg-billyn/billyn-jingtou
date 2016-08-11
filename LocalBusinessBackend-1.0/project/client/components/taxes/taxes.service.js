'use strict';

/**
 * Factory service to handle API request
 */
angular.module('localBusinessApp')
  .factory('Taxes', [
    function() {

      var taxes = [
        {
          name: '15%',
          value: 0.15
        },
        {
          name: '25%',
          value: 0.25
        }
      ];

      // Public API here
      return {
        get: function() {
          return taxes;
        }
      };
    }
  ]);
