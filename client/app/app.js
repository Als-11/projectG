'use strict';

angular.module('guwhaApp', [
  'guwhaApp.auth',
  'guwhaApp.admin',
  'guwhaApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'btford.socket-io',
  'validation.match',
  'ngTable',
  'ui.bootstrap',
  'autocomplete',
  'chart.js',
  'guwhaApp.communityService',
  'siyfion.sfTypeahead',
  'simplePagination',
  'pascalprecht.translate',
  'ncy-angular-breadcrumb',
  'angular-loading-bar',
  '720kb.datepicker',
  'angularUtils.directives.dirPagination',
  'toastr',
  'ui.calendar',
  'infinite-scroll',
  'ui.select',
  'checklist-model'

])


  .config(function($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);

    //$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.common['Accept'] = 'application/json';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
  });
