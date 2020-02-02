'use strict';

angular.module('guwhaApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/dashboard/notifications', {
        template: '<notifications></notifications>'
      });
  });
