'use strict';
(function() {

    class CommunitymembersComponent {
        constructor($http, Auth, NgTableParams,toastr) {
            this.$http = $http;
            this.Auth = Auth;
            this.toastr = toastr;
            this.loggedInRole = this.Auth.getCurrentUser().role;
            this.NgTableParams = NgTableParams;
            this.communitymemberUpdate = [];
            this.communitymemberstable = new this.NgTableParams({
                page: 1,
                count: 5
            }, {
                dataset: [],
                counts: []
            });
            this.communityMembers();
        }

        communityMembers() {
            var _this = this;
            this.$http.get('/api/communitymembersmappings/communitymemberslist')
                .success(function(data) {
                    _this.result = data;
                    _this.refreshTable('communitymemberstable', _this.result);
                }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
        }

        updateMember(row) {
            var _this = this;
            this.id = row.communitymemberId;
            this.$http.post('/api/communitymembersmappings/updatememberslist', {
                phoneNumber: row.phoneNumber,
                toDate: row.toDate,
                communityMemberId: this.id
            }).success(function(data) {
                _this.communitymemberUpdate = data;
                _this.toastr.success('Updates saved!', 'Success');
                _this.refreshTable('communitymemberstable', _this.communitymemberUpdate);
            }).error(function(data) {
                this.toastr.error('Sorry Something Went Wrong!', 'Failed');
            });
        }


        refreshTable(tableName, data) {
            switch (tableName) {
                case 'communitymemberstable':
                    this.communitymemberstable = new this.NgTableParams({
                        page: 1,
                        count: 5
                    }, {
                        dataset: data,
                        counts: []
                    });
            }
        }


    }

    angular.module('guwhaApp')
        .component('communitymembers', {
            templateUrl: 'app/dashboard/communitymembers/communitymembers.html',
            controller: CommunitymembersComponent
        });

})();
