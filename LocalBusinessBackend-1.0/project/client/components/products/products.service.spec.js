'use strict';

describe('Service: Products', function() {

  // load the service's module
  beforeEach(module('localBusinessApp'));

  // instantiate service
  var Products;
  beforeEach(inject(function(_Products_) {
    Products = _Products_;
  }));

  it('should be exist', function() {
    expect(!!Products).toBe(true);
  });
});
