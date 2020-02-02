'use strict';

class FooterController {
  
  constructor(Auth, $location) {
    this.$location = $location;
    this.Auth = Auth;
    this.firstName = this.Auth.getCurrentUser().firstName;
  }
  
  isLoggedIn(){
    // Checking if the user is logged in using Auth Service
    var path = this.$location.path();
     return this.Auth.isLoggedIn() && (path != '/login' && path != '/' && path != '/signup');
  }
  
  userName() {
      return this.Auth.getCurrentUser().firstName;
  }
}

angular.module('guwhaApp')
  .controller('FooterController', FooterController);
