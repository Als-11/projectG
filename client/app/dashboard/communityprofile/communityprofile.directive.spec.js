'use strict';

describe('Directive: communityprofile', function () {

  // load the directive's module and view
  beforeEach(module('guwhaApp.communityprofile'));
  beforeEach(module('app/dashboard/communityprofile/communityprofile.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<communityprofile></communityprofile>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the communityprofile directive');
  }));
});
