angular.module('starter')

  .service('AuthService', function ($q, $rootScope, BSpace, BApp, Util, User, $http, API_ENDPOINT, $localStorage) {
    var LOCAL_TOKEN_KEY = 'yourTokenKey';
    var isAuthenticated = false;
    var authToken;

    var safeCb = Util.safeCb;
    var currentUser = {};
    //   var userRoles = appConfig.userRoles || [];
    $rootScope.current = $rootScope.current || {};

    if (window.localStorage.getItem('LOCAL_TOKEN_KEY') && $location.path() !== '/logout') {
      currentUser = User.get();
    }

    function loadUserCredentials() {
    //  var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
       var token = $localStorage.token;
      if (token) {
        useCredentials(token);
      }
    }

    function storeUserCredentials(token) {
      window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
      $localStorage.Token = token;
      useCredentials(token);
    }

    function useCredentials(token) {
      isAuthenticated = true;
      authToken = token;

      // Set the token as header for your requests!
      //   $http.defaults.headers.common.Authorization = authToken;
    }

    function destroyUserCredentials() {
      authToken = undefined;
      isAuthenticated = false;
      $http.defaults.headers.common.Authorization = undefined;
      window.localStorage.removeItem(LOCAL_TOKEN_KEY);
    }

    // var register = function(user) {
    //   return $q(function(resolve, reject) {
    //    // $http.post(API_ENDPOINT.url + '/signup', user).then(function(result) {
    //      $http.post(API_ENDPOINT.url + '/users', user).then(function(result) {
    //    //   if (result.data.succes) {
    //       if (result.data) {
    //         //resolve(result.data.msg);
    //         resolve(result.data);
    //       } else {
    //         // reject(result.data.msg);
    //         reject(result.data);
    //       }
    //     });
    //   });
    // };

    var register = function (userData, callback) {
      return $http.post('/api/users', userData).then(function (res) {
        storeUserCredentials(res.data.token);
        currentUser = User.get();

        var user = currentUser.$promise;

        return user;

      }).then(function (newUser) {
        $rootScope.current.user = newUser;
        var tName = newUser.name;
        if (newUser.name) {
          tName = newUser.name;
        } else {
          tName = newUser.loginId;
        }
        return BSpace.create({
          name: 'mySpace_' + tName,
          alias: 'mySpace belong to ' + tName,
          roles: ['admin'],
          type: 'person.normal'
        }).then(function (space) {
          $rootScope.current.space = space;
          return BApp.find('appEngine').then(function (app) {
            $rootScope.current.app = app;
            return null;
          });
        }).then(function () {
          return newUser;
        });
      }).then(user => {
        safeCb(callback)(null, user);
        return user;
      })
        .catch(err => {
          logout();
          safeCb(callback)(err.data);
          return $q.reject(err.data);
        });
    };

    var login = function (loginUser, callback) {
      return $http.post('http://localhost:8100/auth/local', {

        loginId: loginUser.loginId,
        password: loginUser.password
      })
        .then(result => {
          storeUserCredentials(result.data.token);
          currentUser = User.get();

          var user = currentUser.$promise;

          return user;
        })
        .then(user => {
          //set current user
          currentUser = user;
          $rootScope.current.user = user;
          return BSpace.getUserSpaces({
            userId: user._id,
            type: 'space.person.normal'
          }).then(spaces => {
            //set current space
            $rootScope.current.space = spaces[0];
            return BApp.find('appEngine').then(app => {
              //set current app
              $rootScope.current.app = app;
              return null;
            });
          }).then(function () {
            return user;
          });
        })
        .then(user => {
          safeCb(callback)(null, user);
          return user;
        })
        .catch(err => {
          logout();
          safeCb(callback)(err.data);
          return $q.reject(err.data);
        });
    };




    //   var login = function(user) {
    //     return $q(function(resolve, reject) {
    //       //$http.post(API_ENDPOINT.url + '/authenticate', user).then(function(result) {
    //          $http.post('http://localhost:8100/auth/local', user).then(function(result) {
    //      //   if (result.data.success) {
    //         if (result.data) {
    //           storeUserCredentials(result.data.token);
    // //          resolve(result.data.msg);
    //           resolve(result.data);

    //         } else {
    // //          reject(result.data.msg);
    //           reject(result.data);
    //         }
    //       });
    //     });
    //   };

    var logout = function () {
      destroyUserCredentials();
    };

    loadUserCredentials();

    return {
      login: login,
      register: register,
      logout: logout,
      isAuthenticated: function () { return isAuthenticated; },
      currentUser: function () {return currentUser;},
    };
  })

// .factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
//   return {
//     responseError: function (response) {
//       $rootScope.$broadcast({
//         401: AUTH_EVENTS.notAuthenticated,
//       }[response.status], response);
//       return $q.reject(response);
//     }
//   };
// })

// .config(function ($httpProvider) {
//   $httpProvider.interceptors.push('AuthInterceptor');
// });
