'use strict';
(function() {

    class ActiveusersComponent {
        constructor($http, Auth, toastr) {
            this.$http = $http;
            this.toastr = toastr;
            this.Auth = Auth;
            this.loggedInRole = this.Auth.getCurrentUser().role;
            this.activeUsers();
        }

        activeUsers() { //active users data
            var _this = this;
            this.$http.get('/api/users/activeusers')
                .success(function(data) {
                    _this.activeusersList = data;
                    console.log(_this.activeusersList);
                }).error(function(data) {
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
        }

        getTheFiles($files) {
            console.log($files);
            this.formdata = new FormData();
            var _this = this;
            angular.forEach($files, function(value, key) {
                _this.formdata.append(key, value);
            });
        };
        uploadFiles() {
            var _this = this;
            var request = {
                method: 'POST',
                url: 'api/users/uploadBulkUsers',
                data: _this.formdata,
                headers: {
                    'Content-Type': undefined
                }
            };

            // SEND THE FILES.

            this.$http(request)
                .success(function(data) {
                   console.log(data);
                   _this.toastr.success("Successfully,saved all users");
                })
                .error(function() {});
        };


    }

    angular.module('guwhaApp')
        .component('activeusers', {
            templateUrl: 'app/dashboard/activeusers/activeusers.html',
            controller: ActiveusersComponent
        });

})();
