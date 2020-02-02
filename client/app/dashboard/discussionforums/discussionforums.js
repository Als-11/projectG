'use strict';

angular.module('guwhaApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/dashboard/discussionforums', {
        template: '<discussionforums></discussionforums>'
      });
  });
