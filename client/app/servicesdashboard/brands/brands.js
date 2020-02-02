'use strict';

angular.module('guwhaApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/servicesdashboard/brands', {
        template: '<brands></brands>'
      });
  });
