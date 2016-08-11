'use strict';

describe('Service: reviews', function () {

  // load the service's module
  beforeEach(module('localBusinessApp'));

  // instantiate service
  var Reviews;
  beforeEach(inject(function (_Reviews_) {
    Reviews = _Reviews_;
  }));

  it('should be exist', function () {
    expect(!!Reviews).toBe(true);
  });

  it('create() should be defined', function() {
    expect(Reviews.create).toBeDefined();
  });

  it('get() should be defined', function() {
    expect(Reviews.get).toBeDefined();
  });

  it('findOne() should be defined', function() {
    expect(Reviews.findOne).toBeDefined();
  });

  it('delete() should be defined', function() {
    expect(Reviews.delete).toBeDefined();
  });

});
