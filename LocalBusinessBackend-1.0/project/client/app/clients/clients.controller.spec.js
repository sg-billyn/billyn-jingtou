'use strict';

describe('clients.controller', function() {
  describe('Controller: ClientsListCtrl', function() {

    // load the controller's module
    beforeEach(module('localBusinessApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('ClientsListCtrl', {
        $scope: scope
      });
    }));

    it('should have a clients model', function() {
      expect(scope.data.records).toBeDefined();
    });
  });
});
