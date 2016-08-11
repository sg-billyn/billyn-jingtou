'use strict';

describe('Service: Taxes', function() {

  // load the service's module
  beforeEach(module('localBusinessApp'));

  // instantiate service
  var Taxes;
  beforeEach(inject(function(_Taxes_) {
    Taxes = _Taxes_;
  }));

  it('should be exist', function() {
    expect(!!Taxes).toBe(true);
  });

  it('get() should be defined', function() {
    expect(Taxes.get).toBeDefined();
  });

});
