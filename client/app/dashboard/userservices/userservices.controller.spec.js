'use strict';

describe('Component: UserServicesComponent', function () {
  // load the controller's module
  beforeEach(module('guwhaApp'));

  var UserServicesComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    ServicesComponent = $componentController('UserServicesComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
