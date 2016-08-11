'use strict';

describe('Controller: AccountsCtrl', function () {

  // load the controller's module
  beforeEach(module('localBusinessApp'));

  var AccountsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AccountsCtrl = $controller('AccountsPhotoCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
