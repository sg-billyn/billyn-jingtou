'use strict';

describe('articles.controller', function() {
  describe('Controller: ArticlesListCtrl', function() {

    // load the controller's module
    beforeEach(module('localBusinessApp'));

    var ArticlesListCtrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      ArticlesListCtrl = $controller('ArticlesListCtrl', {
        $scope: scope
      });
    }));

    it('should have a model to hold the list', function() {
      expect(scope.data.records).toBeDefined();
    });
  });


  describe('Controller: ArticlesAddFormCtrl', function() {

    // load the controller's module
    beforeEach(module('localBusinessApp'));

    var ArticlesListCtrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      ArticlesListCtrl = $controller('ArticlesAddFormCtrl', {
        $scope: scope
      });
    }));

    it('should have a news model', function() {
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

  describe('Controller: ArticlesUpdateFormCtrl', function() {

    // load the controller's module
    beforeEach(module('localBusinessApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('ArticlesUpdateFormCtrl', {
        $scope: scope
      });
    }));

    it('should have models', function() {
      expect(scope.data).toBeDefined();
      expect(scope.data.uploadedImages).toBeDefined();
      expect(scope.data.model).toBeDefined();

      expect(scope.ui).toBeDefined();
      expect(scope.ui.progress).toBeDefined();
      expect(scope.ui.inProgress).toBeDefined();

      expect(scope.onFileSelect).toBeDefined();
      expect(scope.update).toBeDefined();
      expect(scope.trashbin).toBeDefined();
      expect(scope.deleteImage).toBeDefined();
    });
  });

  describe('Controller: ArticlesDetailsCtrl', function() {

    // load the controller's module
    beforeEach(module('localBusinessApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('ArticlesDetailsCtrl', {
        $scope: scope
      });
    }));

    it('should have models', function() {
      expect(scope.data).toBeDefined();
      expect(scope.data.model).toBeDefined();
      expect(scope.ui).toBeDefined();
    });
  });

  describe('Controller: ArticlesItemCtrl', function() {

    // load the controller's module
    beforeEach(module('localBusinessApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('ArticlesItemCtrl', {
        $scope: scope
      });
    }));

    it('should be exist', function() {
      expect(Ctrl).toBeDefined();
      expect(scope.deleteItem).toBeDefined();
    });
  });
});
