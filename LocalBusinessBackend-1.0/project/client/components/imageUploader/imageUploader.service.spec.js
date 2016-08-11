'use strict';

describe('Service: ImageUploader', function () {

  // load the service's module
  beforeEach(module('localBusinessApp'));

  // instantiate service
  var ImageUploader;
  beforeEach(inject(function (_ImageUploader_) {
    ImageUploader = _ImageUploader_;
  }));

  it('should do something', function () {
    expect(!!ImageUploader).toBe(true);
  });

});
