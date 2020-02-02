'use strict';

(function() {

    class ForgotPasswordController {

        constructor($http, $scope, socket, Auth, $location, CommunityService,toastr) {
            this.$http = $http;
            this.socket = socket;
            this.CommunityService = CommunityService;
            this.toastr= toastr;
            this.$location = $location;
            this.Auth = Auth;
            this.communityId = this.Auth.getCurrentUser().communityId;
        }

        verifyEmail(){
            this.emailExists='';
            var _this = this;
                 this.$http.post('/api/users/getemails',{
                  emailId:this.emailId
                  }).success(function(data){
                      _this.$http.post('/api/users/newpassword',{
                        emailId:_this.emailId
                      })
                      .success(function(data){
                         _this.emailExists='Password Has Been Sent To Your Email';
                         _this.color="green";
                      }).error(function(data){
                         
                      })
                  }).error(function(data){
                    _this.emailExists='* Email Does Not Exist';
                    _this.color="red";
                     })

    }
}

    angular.module('guwhaApp')
        .controller('ForgotPasswordController', ForgotPasswordController);

})();
