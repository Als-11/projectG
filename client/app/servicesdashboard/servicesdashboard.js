'use strict';

angular.module('guwhaApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/servicesdashboard', {
        template: '<servicesdashboard></servicesdashboard>'
      });
  });
