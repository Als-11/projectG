'use strict';

angular.module('guwhaApp')
  .directive('communityprofile', function () {
    return {
      templateUrl: 'app/dashboard/communityprofile/communityprofile.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
