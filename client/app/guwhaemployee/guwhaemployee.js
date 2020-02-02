'use strict';

angular.module('guwhaApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/guwhaemployee', {
        template: '<guwhaemployee></guwhaemployee>'
      });
  });
