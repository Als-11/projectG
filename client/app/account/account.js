'use strict';

angular.module('guwhaApp')

  .config(function($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginController',
        controllerAs: 'vm'
      })
      .when('/logout', {
        name: 'logout',
        referrer: '/',
        template: '',
        controller: function($location, $route, Auth,toastr) {
          var referrer = $route.current.params.referrer ||
                          $route.current.referrer ||
                          '/';
                          toastr.success('Successfully Logged Out', 'Success');
          Auth.logout();
          $location.path('/');
        }
      })
      .when('/signup', {
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupController',
        controllerAs: '$ctrl'
      })
      .when('/forgotpassword', {
        templateUrl: 'app/account/forgotpassword/forgotpassword.html',
        controller: 'ForgotPasswordController',
        controllerAs: '$ctrl'
      })
      .when('/admin', {
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminController',
        controllerAs: '$ctrl'
      })
    .when('/serviceprovidersignup', {
        templateUrl: 'app/account/serviceprovidersignup/serviceprovidersignup.html',
        controller: 'ServiceprovidersignupController',
        controllerAs: '$ctrl'
      })
//      .when('/settings', {
//        templateUrl: 'app/account/settings/settings.html',
//        controller: 'SettingsController',
//        controllerAs: 'vm',
//        authenticate: true
//      })
      .when('/billservice', {
        templateUrl: 'app/billservice/billservice.html',
        controller: 'BillserviceComponent',
        controllerAs: 'vm',
        authenticate: true
      });
  })
  .run(function($rootScope) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      if (next.name === 'logout' && current && current.originalPath && !current.authenticate) {
        next.referrer = current.originalPath;
      }
    });
  });
