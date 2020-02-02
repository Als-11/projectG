'use strict';

angular.module('guwhaApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/billservice', {
        template: '<billservice></billservice>'
      });
  });
