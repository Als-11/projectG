'use strict';

describe('Component: AmenitiesBookingComponent', function () {

  // load the controller's module
  beforeEach(module('guwhaApp'));

  var AmenitiesBookingComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    AmenitiesBookingComponent = $componentController('AmenitiesBookingComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
