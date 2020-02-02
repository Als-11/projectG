'use strict';

angular.module('guwhaApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/servicesdashboard/approvedcommunities', {
        template: '<approvedcommunities></approvedcommunities>'
      });
  });
