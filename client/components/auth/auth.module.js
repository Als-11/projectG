'use strict';

angular.module('guwhaApp.auth', [
  'guwhaApp.constants',
  'guwhaApp.util',
  'ngCookies',
  'ngRoute'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
