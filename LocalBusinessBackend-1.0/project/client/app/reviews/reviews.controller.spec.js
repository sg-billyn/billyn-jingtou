'use strict';

describe('reviews.controller', function() {
  describe('Controller: ReviewsListCtrl', function() {

    // load the controller's module
    beforeEach(module('localBusinessApp'));

    var Ctrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('ReviewsListCtrl', {
        $scope: scope
      });
    }));

    it('should have a pages model', function() {
      expect(scope.data.records).toBeDefined();
    });
  });


  describe('Controller: ReviewsAddFormCtrl', function() {

    // load the controller's module
    beforeEach(module('localBusinessApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('ReviewsAddFormCtrl', {
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

  describe('Controller: ReviewsUpdateFormCtrl', function() {

    // load the controller's module
    beforeEach(module('localBusinessApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('ReviewsUpdateFormCtrl', {
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

  describe('Controller: ReviewsDetailsCtrl', function() {

    // load the controller's module
    beforeEach(module('localBusinessApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('ReviewsDetailsCtrl', {
        $scope: scope
      });
    }));

    it('should have model to hold the updated details', function() {
      expect(scope.data).toBeDefined();
      expect(scope.data.model).toBeDefined();

      expect(scope.ui).toBeDefined();
    });
  });

  describe('Controller: ReviewsItemCtrl', function() {

    // load the controller's module
    beforeEach(module('localBusinessApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('ReviewsItemCtrl', {
        $scope: scope
      });
    }));

    it('should be exist', function() {
      expect(Ctrl).toBeDefined();
    });
  });

});