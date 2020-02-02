'use strict';

describe('Component: paymentsComponent', function () {

  // load the controller's module
  beforeEach(module('guwhaApp'));

  var paymentsComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    paymentsComponent = $componentController('paymentsComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
