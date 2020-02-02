'use strict';

angular.module('guwhaApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/dashboard/profile', {
        template: '<profile></profile>'
      });
  });
