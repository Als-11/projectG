'use strict';

angular.module('guwhaApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/dashboard/expenses', {
        template: '<expenses></expenses>'
      });
  });
