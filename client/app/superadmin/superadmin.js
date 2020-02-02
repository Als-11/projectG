'use strict';

angular.module('guwhaApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/superadmin', {
        template: '<superadmin></superadmin>'
      });
  });
