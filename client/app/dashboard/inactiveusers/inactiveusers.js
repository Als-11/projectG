'use strict';

angular.module('guwhaApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/dashboard/inactiveusers', {
        template: '<inactiveusers></inactiveusers>'
      });
  });
