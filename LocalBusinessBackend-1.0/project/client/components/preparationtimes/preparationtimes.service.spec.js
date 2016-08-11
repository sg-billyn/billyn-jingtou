'use strict';

describe('Service: PreparationTimes', function() {

  // load the service's module
  beforeEach(module('localBusinessApp'));

  // instantiate service
  var PreparationTimes;
  beforeEach(inject(function(_PreparationTimes_) {
    PreparationTimes = _PreparationTimes_;
  }));

  it('should be exist', function() {
    expect(!!PreparationTimes).toBe(true);
  });

  it('get() should be defined', function() {
    expect(PreparationTimes.get).toBeDefined();
  });

});
