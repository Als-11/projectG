'use strict';

describe('Directive: billpayments', function () {

  // load the directive's module and view
  beforeEach(module('guwhaApp.billpayments'));
  beforeEach(module('app/dashboard/billpayments/billpayments.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<billpayments></billpayments>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the billpayments directive');
  }));
});
