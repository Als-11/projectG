'use strict';

angular.module('guwhaApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/employeedashboard/securitycomplaints', {
        template: '<securitycomplaints></securitycomplaints>'
      });
  });
