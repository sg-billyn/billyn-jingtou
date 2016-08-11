'use strict';

describe('Service: pages', function () {

  // load the service's module
  beforeEach(module('localBusinessApp'));

  // instantiate service
  var Pages;
  beforeEach(inject(function (_Pages_) {
    Pages = _Pages_;
  }));

  it('should be exist', function () {
    expect(!!Pages).toBe(true);
  });

  it('create() should be defined', function() {
    expect(Pages.create).toBeDefined();
  });

  it('get() should be defined', function() {
    expect(Pages.get).toBeDefined();
  });

  it('findOne() should be defined', function() {
    expect(Pages.findOne).toBeDefined();
  });

  it('delete() should be defined', function() {
    expect(Pages.delete).toBeDefined();
  });
});
