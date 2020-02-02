'use strict';
(function() {

    class NotificationsComponent {
        constructor($http, Auth,$location,$rootScope) {
            // this.socket = $socket;
            this.$http = $http;
            this.Auth = Auth;
            this.user = this.Auth.getCurrentUser().role; 
            this.$location = $location;
            this.$rootScope = $rootScope;
            this.getNotifications();
            if(this.user == 'RESIDENT') {
              this.readNotifications();
            }
            // this.socket.syncUpdates('notifications',this.awesomeThings,function(){
            //   console.log('Some Update happened');
            // });
         }

       getNotifications() {
        var _this = this;
        this.notificationsArray = [];
        this.$http.get('/api/notificationss/getNotification')
        .success(function(data)
        {
             _this.notificationsArray = data; 
            _this.count = _this.notificationsArray.length;
        }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
       }

       readNotifications() {
        var _this = this;
        this.readnotificationsArray = [];
        this.$http.get('/api/notificationss/readNotification')
        .success(function(data)
        { 
           _this.readnotificationsArray = data;
            _this.readNotcount = _this.readnotificationsArray.length;
        }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
       }
       markAllRead() {
        var _this = this;
         this.$http.get('/api/notificationss/markAllRea')
         .success(function(data)
         {
             _this.getNotifications();
             _this.readNotifications() ;
         }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
       }
       action(x,notification) {
           var _this = this;
           if(x==1){
            this.selectedCat = "Accept"
           }
           else if(x==2){
             this.selectedCat = "Decline"
           }
           else if(x==3){
             this.selectedCat = "Maybe"
           }
           this.seleNotif = notification;
           this.$http.post('/api/notificationss/doaction',{
            selected:this.selectedCat,
            uniqueId:this.seleNotif._id.notificationuniqueId,
            notificationId:this.seleNotif._id.notificationId
           }).success(function(data)
           {
               _this.getNotifications();
              _this.readNotifications() ;
           }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
       }



    }   
    angular.module('guwhaApp')
        .component('notifications', {
            templateUrl: 'app/dashboard/notifications/notifications.html',
            controller: NotificationsComponent
        });

})();