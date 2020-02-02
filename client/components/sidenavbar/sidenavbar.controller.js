'use strict';

class SidenavbarComponent {

    constructor(Auth, $location, toastr, $http) {
        this.$location = $location;
        this.$http = $http;
        this.Auth = Auth;
        this.toastr = toastr;
        this.activemethods = false;
        window.documReady = false;
        angular.element(document).ready(function () {
            window.roles = Auth.getCurrentUser().role; //making global objects
             window.globalFirstNames = Auth.getCurrentUser().firstName;
            window.documReady = true;
        });

        if (this.activemethods = false) {
            this.getNotificationCount();
            this.getNotifications();
            this.profilePicture();
        }

    }
    methods() {
        this.activemethods = true;
        this.getNotificationCount();
        this.getNotifications();
        this.profilePicture();
    }

    //   methods() {
    //     if(this.Auth.isLoggedIn()) {
    //       this.getNotificationCount();
    //       this.getNotifications();
    //     }
    //     else {
    //       if(window.documReady == true) {  
    //         this.getNotificationCount();
    //         this.getNotifications();
    //     }
    //   }
    // }

// <<<<<<< HEAD
//     profilePicture() { // profile picture of the user
//         var _this = this;
//         var _this = this;
//         this.$http.get('/api/users/profilePicture')
//             .success(function (data) {
//                 _this.imager = data.imageUrl;
//             })
//     }


// =======
// >>>>>>> 037cea2072bdd7fa99e1ca7b5f2eaf4fd5165627
    isLoggedIn() { // Checking if the user is logged in using Auth Service
        var path = this.$location.path();
        if (this.Auth.isLoggedIn()) //here we check is logged in
        {
            if (this.Auth.getCurrentUser().role != undefined) { //here we check to aceess the auth values or not 
                this.role = this.Auth.getCurrentUser().role;
                this.globalFirstName = this.Auth.getCurrentUser().firstName;
            } else {
                if (window.documReady == true) { //if not than we access from readyfunction 
                    this.role = window.roles;
                    this.globalFirstName = window.globalFirstNames;
                } else {
                    this.toastr.info('Something Went Wrong,please refresh the page');
                }
            }
        }

        return this.Auth.isLoggedIn() && (path != '/login' && path != '/' && path != '/signup');

    }

     profilePicture() { // profile picture of the user
        var _this = this;
        var _this = this;
        this.$http.get('/api/users/profilePicture')
            .success(function (data) {
                _this.role = _this.Auth.getCurrentUser().role
                 _this.imager = data.imageUrl + '?_ts=' + new Date().getTime();
                if(window.roles == 'EMPLOYEE' || _this.role =='EMPLOYEE' ){ // for security only,we show visitormanagement
                    _this.employeeType= data.employeeType;
                }
            })
    }

    getNotificationCount() {
        // var _this = this;
        // this.validUser = this.Auth.isLoggedIn();
        // if(this.validUser == true){
        var path = this.$location.path();
        var _this = this;
        // alert("hello");
        if (this.Auth.isLoggedIn() && (path != '/login' && path != '/' && path != '/signup')) {
            this.$http.get('/api/notificationss/unreadcount')
                .success(function (data) {
                    _this.count = data;
                }).error(function (data) {
                    _this.count = 0
                })
        }

    }

    getNotifications() {
        // var _this = this;
         //  if(this.validUser == true){
        // _this.getNotificationsArray = [];
        var path = this.$location.path();
        var _this = this;
        if (this.Auth.isLoggedIn() && (path != '/login' && path != '/' && path != '/signup')) {
            this.$http.get('/api/notificationss/getEnvelopNotification')
                .success(function (data) {
                    _this.getNotificationsArray = data;
                 })
        }
                    
    }

    notifCount() {
        var _this = this;
        _this.count = 0;
    }

}

angular.module('guwhaApp')
    .controller('SidenavbarComponent', SidenavbarComponent);