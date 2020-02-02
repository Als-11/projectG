'use strict';

describe('Component: ServicesdashboardComponent', function () {

  // load the controller's module
  beforeEach(module('guwhaApp'));

  var ServicesdashboardComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    ServicesdashboardComponent = $componentController('ServicesdashboardComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
