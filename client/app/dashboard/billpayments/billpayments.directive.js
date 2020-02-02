'use strict';

angular.module('guwhaApp')
  .directive('billpayments', function () {
    return {
      templateUrl: 'app/dashboard/billpayments/billpayments.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
