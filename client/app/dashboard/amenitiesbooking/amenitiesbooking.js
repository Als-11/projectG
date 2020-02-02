'use strict';

angular.module('guwhaApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/dashboard/amenitiesbooking', {
        template: '<amenitiesbooking></amenitiesbooking>'
      });
  });
