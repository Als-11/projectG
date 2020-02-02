'use strict';

angular.module('guwhaApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/servicesdashboard/declinecommunities', {
        template: '<declinecommunities></declinecommunities>'
      });
  });
