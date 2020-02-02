'use strict';

angular.module('guwhaApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/dashboard/userservices', {
        template: '<userservices></userservices>'
      });
  });
