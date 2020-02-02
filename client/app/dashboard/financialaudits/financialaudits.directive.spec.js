'use strict';

describe('Directive: financialaudits', function () {

  // load the directive's module and view
  beforeEach(module('financialaudits'));
  beforeEach(module('app/dashboard/financialaudits/financialaudits.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<financialaudits></financialaudits>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the financialaudits directive');
  }));
});
