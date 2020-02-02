'use strict';

angular.module('guwhaApp')
  .directive('financialaudits', function () {
    return {
      templateUrl: 'app/dashboard/financialaudits/financialaudits.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
