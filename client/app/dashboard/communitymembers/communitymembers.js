'use strict';

angular.module('guwhaApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/dashboard/communitymembers', {
        template: '<communitymembers></communitymembers>'
      });
  });
