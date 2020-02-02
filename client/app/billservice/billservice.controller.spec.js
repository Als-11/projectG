'use strict';

describe('Component: BillserviceComponent', function () {

  // load the controller's module
  beforeEach(module('guwhaApp'));

  var BillserviceComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    BillserviceComponent = $componentController('BillserviceComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
