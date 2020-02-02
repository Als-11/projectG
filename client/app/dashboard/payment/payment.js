'use strict';

angular.module('guwhaApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/dashboard/payment', {
        template: '<payment></payment>'
      });
  });
