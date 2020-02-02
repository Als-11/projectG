'use strict';

angular.module('guwhaApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/employeedashboard', {
        template: '<employeedashboard></employeedashboard>'
      });
  });
