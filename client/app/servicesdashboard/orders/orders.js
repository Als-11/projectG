'use strict';

angular.module('guwhaApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/servicesdashboard/orders', {
        template: '<orders></orders>'
      });
  });
