'use strict';

describe('Component: ComplaintComponent', function () {

  // load the controller's module
  beforeEach(module('guwhaApp'));

  var ComplaintComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    ComplaintComponent = $componentController('ComplaintComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
