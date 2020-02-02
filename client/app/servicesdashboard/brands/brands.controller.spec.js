'use strict';

describe('Component: BrandsComponent', function () {

  // load the controller's module
  beforeEach(module('guwhaApp'));

  var BrandsComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    BrandsComponent = $componentController('BrandsComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
