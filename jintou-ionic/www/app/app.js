angular.module('starter', ['ionic', 'ngResource', 'ngStorage'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  // .state('outside', {
  //   url: '/outside',
  //   abstract: true,
  //   templateUrl: 'templates/outside.html'
  // })
  .state('login', {
    url: '/login',
    templateUrl: 'app/account/login/login.html',
    controller: 'LoginCtrl'
  })
  .state('register', {
    url: '/register',
    templateUrl: 'app/account/signup/signup.html',
    controller: 'SignupCtrl'
  })
  // .state('inside', {
  //   url: '/inside',
  //   templateUrl: 'templates/inside.html',
  //   controller: 'InsideCtrl'
  // })
    .state('myspaces', {
    url: '/myspaces',
    templateUrl: 'app/space/mySpaces.html',
    controller: 'MySpacesCtrl'
  });

  $urlRouterProvider.otherwise('/login');
 //  $urlRouterProvider.otherwise('/outside/login');
})

.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
    if (!AuthService.isAuthenticated()) {
      console.log(next.name);
  //    if (next.name !== 'outside.login' && next.name !== 'outside.register') {
     if (next.name !== 'login' && next.name !== 'register') {
        event.preventDefault();
        $state.go('login');
      }
    }
  });
});
