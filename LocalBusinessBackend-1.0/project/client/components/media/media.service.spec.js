'use strict';

describe('Service: Media', function() {

  // load the service's module
  beforeEach(module('localBusinessApp'));

  // instantiate service
  var Media;
  beforeEach(inject(function(_Media_) {
    Media = _Media_;
  }));

  it('should be exist', function() {
    expect(!!Media).toBe(true);
  });

  it('create() should be defined', function() {
    expect(Media.create).toBeDefined();
  });

  it('get() should be defined', function() {
    expect(Media.get).toBeDefined();
  });

  it('findOne() should be defined', function() {
    expect(Media.findOne).toBeDefined();
  });

  it('delete() should be defined', function() {
    expect(Media.delete).toBeDefined();
  });

});
