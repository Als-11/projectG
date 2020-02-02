'use strict';

angular.module('guwhaApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/dashboard/activeusers', {
        template: '<activeusers></activeusers>'
      });
  });
