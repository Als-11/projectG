'use strict';

angular.module('guwhaApp')
  .directive('guwhafooter', () => ({
    templateUrl: 'components/common/bottom.html',
    restrict: 'E',
    controller: 'FooterController',
    controllerAs: 'footer'
  }));

