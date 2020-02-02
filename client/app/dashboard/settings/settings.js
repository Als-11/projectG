'use strict';

angular.module('guwhaApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/dashboard/settings', {
        template: '<settings></settings>'
      });
  });
