'use strict';

describe('pages.controller', function() {
  describe('Controller: PagesListCtrl', function() {

    // load the controller's module
    beforeEach(module('localBusinessApp'));

    var Ctrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('PagesListCtrl', {
        $scope: scope
      });
    }));

    it('should have a pages model', function() {
      expect(scope.data.records).toBeDefined();
    });
  });

  describe('Controller: PagesAddFormCtrl', function() {

    // load the controller's module
    beforeEach(module('localBusinessApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('PagesAddFormCtrl', {
        $scope: scope
      });
    }));

    it('should have models', function() {
      expect(scope.data).toBeDefined();

      expect(scope.data.model).toBeDefined();

      expect(scope.ui).toBeDefined();
      expect(scope.ui.progress).toBeDefined();
      expect(scope.ui.inProgress).toBeDefined();

      expect(scope.onFileSelect).toBeDefined();
      expect(scope.save).toBeDefined();

      expect(scope.deleteImage).toBeDefined();
    });
  });

  describe('Controller: PagesUpdateFormCtrl', function() {

    // load the controller's module
    beforeEach(module('localBusinessApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('PagesUpdateFormCtrl', {
        $scope: scope
      });
    }));

    it('should have models', function() {
      expect(scope.trashbin).toBeDefined();

      expect(scope.data).toBeDefined();
      expect(scope.data.uploadedImages).toBeDefined();

      expect(scope.ui).toBeDefined();
      expect(scope.ui.progress).toBeDefined();
      expect(scope.ui.inProgress).toBeDefined();

      expect(scope.onFileSelect).toBeDefined();
      expect(scope.update).toBeDefined();

      expect(scope.deleteImage).toBeDefined();
    });
  });

  describe('Controller: PagesDetailsCtrl', function() {

    // load the controller's module
    beforeEach(module('localBusinessApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('PagesDetailsCtrl', {
        $scope: scope
      });
    }));

    it('should have model to hold the updated details', function() {
      expect(scope.data.model).toBeDefined();
    });
  });

  describe('Controller: PagesItemCtrl', function() {

    // load the controller's module
    beforeEach(module('localBusinessApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('PagesItemCtrl', {
        $scope: scope
      });
    }));

    it('should be exist', function() {
      expect(Ctrl).toBeDefined();
      expect(scope.deletePage).toBeDefined();
    });
  });

});