'use strict';

describe('Service: Galleries', function() {

  // load the service's module
  beforeEach(module('localBusinessApp'));

  // instantiate service
  var Galleries;
  beforeEach(inject(function(_Galleries_) {
    Galleries = _Galleries_;
  }));

  it('should be exist', function() {
    expect(!!Galleries).toBe(true);
  });
});
