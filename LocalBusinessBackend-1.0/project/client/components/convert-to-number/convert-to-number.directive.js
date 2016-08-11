'use strict';

/**
 * The following is a convert-to-number directive which essentially parses
 * numeric values to strings for binding and strings to numbers on unbinding
 *
 * http://weblog.west-wind.com/posts/2015/May/21/Angular-Select-List-Value-not-binding-with-Static-Values
 */
angular.module('localBusinessApp')
  .directive('convertToNumber', function() {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function(val) {
                return parseInt(val, 10);
            });
            ngModel.$formatters.push(function (val) {
                return '' + val;
            });
        }
    };
});
