'use strict';
(function() {

    class InactiveusersComponent {
        constructor($http, NgTableParams, Auth, toastr) {
            this.message = 'Hello';
            this.$http = $http;
            this.toastr = toastr;
            this.result = [];
            this.inactiveApprovalsList = [];
            this.approvalsList = [];
            this.Auth = Auth;
            this.loggedInRole = this.Auth.getCurrentUser().role;
            this.communityId = this.Auth.getCurrentUser().communityId;
            this.inactiveApprovals();
        }

        inactiveApprovals() {
            var _this = this;
            this.$http.post('/api/approvals/getApprovals', { 'communityId': this.communityId })
                .success(function(data) { 
                    _this.approvalsList = data;
                });
        }

        approvedUser(row) { 
            var _this = this;
            var approvedUsers = row;
            var email = approvedUsers.emailId;
            var userName = approvedUsers.firstName;
            var phoneNumber = approvedUsers.phoneNumber;
            var blockName = approvedUsers.blockName;
            // var floorNumber = approvedUsers.floorNumber;
            var flatNumber = approvedUsers.flatNumber;
            this.$http.post('/api/approvals/approveUser', {
                emailId: email,
                userName: userName,
                phoneNumber: phoneNumber,
                blockName: blockName,
                flatNumber: flatNumber
            }).success(function(data) {
                _this.toastr.success(userName + ' Approved as Resident!', 'Success');
                for (var i = 0; i < _this.approvalsList.length; i++) {
                    if (_this.approvalsList[i].emailId === data.emailId) {
                        _this.approvalsList.splice(i, 1);
                        break;
                    }
                }
            }).error(function() {
                _this.toastr.error('No More Users To Approve!', 'Failed');
            });

        }

        rejectUser(row) {
            var _this = this;
            var approvedUsers = row;
            var userName = approvedUsers.firstName;
            this.$http.post('/api/approvals/rejectUser', { emailId: approvedUsers.emailId })
                .success(function(data) {
                    _this.toastr.success(userName + '  is Rejected', 'Success');
                    for (var i = 0; i < _this.approvalsList.length; i++) {
                        if (_this.approvalsList[i].emailId === data.emailId) {
                            _this.approvalsList.splice(i, 1);
                            break;
                        }
                    }
                }).error(function() {
                    _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
                });
        }

    }

    angular.module('guwhaApp')
        .component('inactiveusers', {
            templateUrl: 'app/dashboard/inactiveusers/inactiveusers.html',
            controller: InactiveusersComponent
        });

})();
