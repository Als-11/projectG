'use strict';

angular.module('guwhaApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/dashboard/services', {
        template: '<services></services>'
      });
  });
