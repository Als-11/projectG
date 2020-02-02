'use strict';

angular.module('guwhaApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/dashboard/complaint', {
        template: '<complaint></complaint>'
      });
  });
