'use strict';

describe('Component: DiscussionforumsComponent', function () {

  // load the controller's module
  beforeEach(module('guwhaApp'));

  var DiscussionforumsComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    DiscussionforumsComponent = $componentController('DiscussionforumsComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
