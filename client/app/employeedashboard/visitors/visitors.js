'use strict';

angular.module('guwhaApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/employeedashboard/visitors', {
        template: '<visitors></visitors>'
      });
  });
