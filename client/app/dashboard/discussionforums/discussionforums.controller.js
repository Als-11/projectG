'use strict';
(function() {

    class DiscussionforumsComponent {
        constructor($http,Auth,toastr) {
            this.$http = $http;
            this.toastr = toastr;
            this.Auth = Auth;
        }
       

          
        sendNotifcation() {
            var _this = this;
            this.$http.post('/api/notificationss/saveNotification',{
                title:this.title,
                description:this.description,
                pollingStatus:this.pollingStatus
            }).success(function(data)
            {
               _this.toastr.success("Successfully,send the notification to all the Users");
               _this.title = '';
               _this.description = '';
               _this.pollingStatus = '';
            }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
        }

        cancel(){
            var _this = this;
            this.title = "";
            this.description = "";
        }
    }

    angular.module('guwhaApp')
        .component('discussionforums', {
            templateUrl: 'app/dashboard/discussionforums/discussionforums.html',
            controller: DiscussionforumsComponent
        });

})();
