'use strict';

describe('Service: paginator', function() {

  // load the service's module
  beforeEach(module('localBusinessApp'));

  // instantiate service
  var paginator;
  beforeEach(inject(function(_paginator_) {
    paginator = _paginator_;
  }));

  it('should do something', function() {
    expect(!!paginator).toBe(true);
  });

});