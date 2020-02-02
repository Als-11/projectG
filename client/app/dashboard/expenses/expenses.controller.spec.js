'use strict';

describe('Component: ExpensesComponent', function () {

  // load the controller's module
  beforeEach(module('guwhaApp'));

  var ExpensesComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    ExpensesComponent = $componentController('ExpensesComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
