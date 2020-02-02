'use strict';

angular.module('guwhaApp')
  .directive('sidenavbar', () => ({
    templateUrl: 'components/sidenavbar/sidenavbar.html',
    restrict: 'E',
    controller: 'SidenavbarComponent',
    controllerAs: 'sidenavbar',
    link: function(scope, element,sidenavbar) 
      {
       
        element.addClass('sidenavbar');
      }

  }));

