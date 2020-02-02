'use strict';

describe('Component: SuperadminComponent', function () {
  // load the controller's module
  beforeEach(module('guwhaApp'));

  var SuperadminComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    SuperadminComponent = $componentController('SuperadminComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
