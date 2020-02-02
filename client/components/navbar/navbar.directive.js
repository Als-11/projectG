'use strict';

angular.module('guwhaApp')
  .directive('navbar', () => ({
    templateUrl: 'components/common/top.html',
    restrict: 'E',
    controller: 'NavbarController',
    controllerAs: 'nav'
  }));
