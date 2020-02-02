'use strict';

describe('Component: SecuritycomplaintsComponent', function () {

  // load the controller's module
  beforeEach(module('guwhaApp'));

  var SecuritycomplaintsComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    SecuritycomplaintsComponent = $componentController('SecuritycomplaintsComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
