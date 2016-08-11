'use strict';

describe('Controller: PushCtrl', function () {

  // load the controller's module
  beforeEach(module('localBusinessApp'));

  var PushCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PushCtrl = $controller('PushCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
