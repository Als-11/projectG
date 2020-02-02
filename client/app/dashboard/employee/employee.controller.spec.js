'use strict';

describe('Component: EmployeeComponent', function () {

  // load the controller's module
  beforeEach(module('guwhaApp'));

  var EmployeeComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    EmployeeComponent = $componentController('EmployeeComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
