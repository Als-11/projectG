'use strict';

describe('Component: ApprovedCommunitiesComponent', function () {

  // load the controller's module
  beforeEach(module('guwhaApp'));

  var ApprovedCommunitiesComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    ApprovedCommunitiesComponent = $componentController('ApprovedCommunitiesComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
