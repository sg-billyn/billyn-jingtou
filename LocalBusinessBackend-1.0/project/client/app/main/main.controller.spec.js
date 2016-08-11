'use strict';

describe('Controller: MainCtrl', function() {

  // load the controller's module
  beforeEach(module('localBusinessApp'));

  var Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    Ctrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should be exist', function() {
    expect(Ctrl).toBeDefined();
  });
});