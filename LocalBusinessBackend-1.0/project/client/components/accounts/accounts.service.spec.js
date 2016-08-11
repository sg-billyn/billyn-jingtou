'use strict';

describe('Service: accounts', function () {

  // load the service's module
  beforeEach(module('localBusinessApp'));

  // instantiate service
  var Accounts;
  beforeEach(inject(function (_Accounts_) {
    Accounts = _Accounts_;
  }));

  it('should be exist', function () {
    expect(!!Accounts).toBe(true);
  });

  it('create() should NOT be defined', function() {
    expect(Accounts.create).not.toBeDefined();
  });

  it('get() should be defined', function() {
    expect(Accounts.get).toBeDefined();
  });

  it('findOne() should be defined', function() {
    expect(Accounts.findOne).toBeDefined();
  });

  it('delete() should NOT be defined', function() {
    expect(Accounts.delete).not.toBeDefined();
  });

});
