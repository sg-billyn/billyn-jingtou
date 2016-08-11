'use strict';

describe('Service: Services', function() {

  // load the service's module
  beforeEach(module('localBusinessApp'));

  // instantiate service
  var Services;
  beforeEach(inject(function(_Services_) {
    Services = _Services_;
  }));

  it('should be exist', function() {
    expect(!!Services).toBe(true);
  });
});
