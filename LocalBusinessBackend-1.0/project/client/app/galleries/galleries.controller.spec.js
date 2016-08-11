'use strict';

describe('galleries.controller', function() {
  describe('Controller: GalleriesListCtrl', function() {

    // load the controller's module
    beforeEach(module('localBusinessApp'));

    var Ctrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('GalleriesListCtrl', {
        $scope: scope
      });
    }));

    it('should have a galleries model', function() {
      expect(scope.data.records).toBeDefined();
    });
  });

  describe('Controller: GalleriesAddFormCtrl', function() {

    // load the controller's module
    beforeEach(module('localBusinessApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('GalleriesAddFormCtrl', {
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

  describe('Controller: GalleriesUpdateFormCtrl', function() {

    // load the controller's module
    beforeEach(module('localBusinessApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('GalleriesUpdateFormCtrl', {
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

  describe('Controller: GalleriesDetailsCtrl', function() {

    // load the controller's module
    beforeEach(module('localBusinessApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('GalleriesDetailsCtrl', {
        $scope: scope
      });
    }));

    it('should have model to hold the updated details', function() {
      expect(scope.data.model).toBeDefined();
    });
  });

  describe('Controller: GalleriesItemCtrl', function() {

    // load the controller's module
    beforeEach(module('localBusinessApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('GalleriesItemCtrl', {
        $scope: scope
      });
    }));

    it('should be exist', function() {
      expect(Ctrl).toBeDefined();
      expect(scope.deleteItem).toBeDefined();
    });
  });

});