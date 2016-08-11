'use strict';

angular.module('localBusinessApp')
  .controller('PushCtrl', function ($scope, $http, $window) {
    $scope.push = {};

    $scope.send = function(){
      var apiKey = ''; //Set the key

      $http.post('https://api.cloud.appcelerator.com/v1/users/login.json?key=' + apiKey + '&pretty_json=true', {
        'login': 'skounis@gmail.com',
        'password': 'password'
      }).success(function(responce){
        console.log(responce);

        /*jshint camelcase: false */
        var sessionId = responce.meta.session_id;
        /*jshint camelcase: true */
        var url = 'https://api.cloud.appcelerator.com/v1/push_notification/notify.json?key=' + apiKey + '&pretty_json=true&_session_id=' + sessionId;

        var payload = {
          'payload': $scope.push.message,
          'to_ids': 'everyone',
          'channel': $scope.push.channel
        };

        // Session id
        // 'https://api.cloud.appcelerator.com/v1/push_notification/notify.json?key=' + apiKey + '&_session_id=bzvXsSXxoMtpvZugTRhM8Jt-i4Q
        //
        $http.post(url, payload).
        success(function(data, status, headers, config){
          console.log(data);
          console.log(status);
          console.log(headers);
          console.log(config);
          $window.alert('Message sent.');
        }).
        error(function(data, status, headers, config) {
          console.log(data);
          console.log(status);
          console.log(headers);
          console.log(config);
          $window.alert('An error occurred.');
        });
      });
    };

    $(window).trigger('resize');

  });
