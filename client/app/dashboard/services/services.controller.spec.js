'use strict';

describe('Component: ServicesComponent', function () {
  // load the controller's module
  beforeEach(module('guwhaApp'));

  var ServicesComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    ServicesComponent = $componentController('ServicesComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
