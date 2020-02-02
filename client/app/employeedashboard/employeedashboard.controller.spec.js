'use strict';

describe('Component: EmployeedashboardComponent', function () {

  // load the controller's module
  beforeEach(module('guwhaApp'));

  var EmployeedashboardComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    EmployeedashboardComponent = $componentController('EmployeedashboardComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
