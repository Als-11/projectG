'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': 'Home',
    'link': '/'
  }];

  isCollapsed = true;
  //end-non-standard

  constructor($location, Auth) {
    this.$location = $location;
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
  }

  isActive(route)
  {
    return route === this.$location.path();
  }
  
  isLoggedIn(){
    // Checking if the user is logged in using Auth Service
    return this.Auth.isLoggedIn();
  }
}

angular.module('guwhaApp')
  .controller('NavbarController', NavbarController);
