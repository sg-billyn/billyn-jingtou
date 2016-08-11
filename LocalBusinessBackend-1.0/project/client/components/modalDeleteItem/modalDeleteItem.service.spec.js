'use strict';

describe('Service: modalDeleteItem', function () {

  // load the service's module
  beforeEach(module('localBusinessApp'));

  // instantiate service
  var modalDeleteItem;
  beforeEach(inject(function (_modalDeleteItem_) {
    modalDeleteItem = _modalDeleteItem_;
  }));

  it('should do something', function () {
    expect(!!modalDeleteItem).toBe(true);
  });

});
