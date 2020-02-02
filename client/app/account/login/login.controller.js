'use strict';

class LoginController {
  constructor(Auth, $location,$rootScope,toastr,$http) {
    this.user = {};
    this.errors = {};
    this.$http = $http;
    this.submitted = false;
    this.toastr = toastr;
    this.$rootScope = $rootScope;
    this.Auth = Auth;
    this.$location = $location;
    if (this.Auth !== undefined && this.Auth.isLoggedIn() === true) {
        // Welcome sir you are logged in
       // this.$location.path('/dashboard');
    } else {
        // Sorry trespassers not allowed
        this.$location.path('/login');
    }
  }

  login(form) {
    var _this = this;
    this.submitted = true;
    if (form.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
      .then(() => {

        _this.$http.get('/api/amenities/redirectUser')
        .success(function(data)
        {
            _this.$location.path(data);
        }).error(function(data)
        {
            _this.toastr.error("Sorry!Something went wrong");  


        })
       // Logged in, redirect to home
        // if(this.Auth.hasRole('SUPER_ADMIN')) {
        //   this.$location.path('/superadmin');
        //  }
        // else if(this.Auth.hasRole('COMMUNITY_ADMIN')||this.Auth.hasRole('RESIDENT')) {
        //   this.$location.path('/dashboard');
        //   } 
        // else if(this.Auth.hasRole('EMPLOYEE')) {
        //    this.employeeType = this.Auth.getEmployeeType();
        //     if(this.employeeType === 'SECURITY'){
        //             this.$location.path('/employeedashboard/visitors')
        //         }
        //      else if(this.employeeType != 'SECURITY'){
        //            this.$location.path('/employeedashboard') 
        //         }
        //     else if(this.employeeType === undefined){
        //          toastr.error("Sorry!SomeThing Went Wrong");
        //     }
        // } 
        //  else if(this.Auth.hasRole('SERVICE_PROVIDER')) {
        //   this.$location.path('/servicesdashboard');
        //  }
        // else if(this.Auth.hasRole('GUWHA_EMPLOYEE')){
        //     this.$location.path('/guwhaemployee');
        // }
      })
      .catch(err => {
        var _this=this;
        _this.error=err.message;
        
      });
    }
  }
}

angular.module('guwhaApp')
  .controller('LoginController', LoginController);
