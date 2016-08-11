'use strict';

describe('Service: Articles', function() {

  // load the service's module
  beforeEach(module('localBusinessApp'));

  // instantiate service
  var Articles;
  beforeEach(inject(function(_Articles_) {
    Articles = _Articles_;
  }));

  it('should be exist', function() {
    expect(!!Articles).toBe(true);
  });

  it('create() should be defined', function() {
    expect(Articles.create).toBeDefined();
  });

  it('update() should be defined', function() {
    expect(Articles.update).toBeDefined();
  });

  it('get() should be defined', function() {
    expect(Articles.get).toBeDefined();
  });

  it('findOne() should be defined', function() {
    expect(Articles.findOne).toBeDefined();
  });

  it('delete() should be defined', function() {
    expect(Articles.delete).toBeDefined();
  });

});
