'use strict';

describe('Component: DeclineCommunitiesComponent', function () {

  // load the controller's module
  beforeEach(module('guwhaApp'));

  var DeclineCommunitiesComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    DeclineCommunitiesComponent = $componentController('DeclineCommunitiesComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
