'use strict';

angular.module('guwhaApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/servicesdashboard/payments', {
        template: '<payments></payments>'
      });
  });
