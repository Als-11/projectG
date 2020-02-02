'use strict';

describe('Component: ActiveusersComponent', function () {

  // load the controller's module
  beforeEach(module('guwhaApp'));

  var ActiveusersComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    ActiveusersComponent = $componentController('ActiveusersComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
