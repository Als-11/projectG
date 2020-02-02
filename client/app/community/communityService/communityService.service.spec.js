'use strict';

describe('Service: communityService', function () {

  // load the service's module
  beforeEach(module('guwhaApp.communityService'));

  // instantiate service
  var communityService;
  beforeEach(inject(function (_communityService_) {
    communityService = _communityService_;
  }));

  it('should do something', function () {
    expect(!!communityService).toBe(true);
  });

});
