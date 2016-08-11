'use strict';

describe('Service: Catalogs', function() {

  // load the service's module
  beforeEach(module('localBusinessApp'));

  // instantiate service
  var Catalogs;
  beforeEach(inject(function(_Catalogs_) {
    Catalogs = _Catalogs_;
  }));

  it('should be exist', function() {
    expect(!!Catalogs).toBe(true);
  });
});
