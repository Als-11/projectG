'use strict';

angular.module('guwhaApp')
  .config(function ($routeProvider, $breadcrumbProvider) {
    $routeProvider
      .when('/dashboard/employee', {
        template: '<employee></employee>',
        ncyBreadcrumb: {
                    label: 'Simple Line Icons'
                }
      });
  });
