'use strict';

describe('Component: CommunitymembersComponent', function () {

  // load the controller's module
  beforeEach(module('guwhaApp'));

  var CommunitymembersComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    CommunitymembersComponent = $componentController('CommunitymembersComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
