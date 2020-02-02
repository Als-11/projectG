'use strict';
(function() {

    class EmployeedashboardComponent {

        constructor(Auth, $http, CommunityService, toastr,$rootScope,$location) {
            this.Auth = Auth;
           //  this.$rootScope = $rootScope;
           //  this.$rootScope.globalFirstName = this.Auth.getCurrentUser().firstName;
           this.role =  this.Auth.getRole();
           this.$location = $location;
            this.toastr = toastr;
            this.$http = $http;
            this.$location = $location;
            this.showVisitors = false;
            this.CommunityService = CommunityService;
            this.User = this.Auth.getCurrentUser();
            if (this.Auth !== undefined && this.Auth.isLoggedIn() === true) {
                this.$location.path('/employeedashboard');
            } else {
                this.$location.path('/');
            }
            this.firstName = this.Auth.getCurrentUser().firstName;
            this.communityId = this.Auth.getCurrentUser().userId;
            this.employeedashboardMethods();
        }

        employeedashboardMethods() {
            this.getEmployeeType();
            this.assignedComplaints();
            this.getComplaints();
        }

        getEmployeeType() { //for show and hide the visitors in navbar
            var _this = this;
            this.CommunityService.getEmployeeType()
                .success(function(data) {
                    if (data.employeeType === 'SECURITY') {
                        _this.employeeType = data.employeeType;
                    }
                })
                .error(function(){
                    _this.toastr.error("sorry! Something Went Wrong");
                });
        }


        complaintHistory(user) {
            this.show = true;
            window.user = user;
            window.complaintId = user.complaintId;
            var _this = this;
            this.$http.post('/api/historys/getComplaintHistory', {
                complaintId: user.complaintId
            }).success(function(data) {
                _this.complaintHistoryresult = data;
            }).error(function() {
                _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
            })
        }


        commentsHistory(user) {
            this.commentsHistoryShow = true;
            this.complaintId = user.complaintId;
            var _this = this;
            _this.result = [];
            this.$http.post('/api/comments/commentsHistory', {
                    complaintId: user.complaintId
                })
                .success(function(data) {
                    _this.result = data;
                }).error(function(data) {
                    _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
                });
        }




        createComments() {
            var _this = this;
            // this.id = this.Auth.getCurrentUser().userId;
            this.$http.post('api/comments/commentsCreate', {
                complaintId: window.complaintId,
                description: this.commentsss
            }).success(function(data) {
                _this.comments = data;
                _this.result.push(_this.comments);
                _this.comments = null;

            }).error(function(data) {
                _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
            })
            this.complaintHistory(window.user);
        }

        assignedComplaints() {
            var _this = this;
            this.resultArray = [];
            this.resultArra = [];
            this.$http.get('/api/complaints/complaintsCounts')
                .success(function(data) {
                    _this.resultArray = data;
                    _this.status = ["Assigned", "Closed", "Pending", "Rejected"]
                    if (_this.resultArray.length === 0) {
                        for (var i = 0; i < _this.status.length; i++) {
                            var statusPush = {
                                _id: {}
                            }
                            statusPush._id.status = _this.status[i];
                            statusPush.count = "0";
                        }
                        _this.resultArra.push(statusPush)
                    } else {
                        for (var i = 0; i < _this.resultArray.length; i++) {
                            _this.resultArra.push(_this.resultArray[i]._id.status);
                        }

                        for (var i = 0; i < _this.status.length; i++) {
                            if (_this.resultArra.includes(_this.status[i])) {} else {
                                var statusPush = {
                                    _id: {}
                                };
                                statusPush._id.status = _this.status[i];
                                statusPush.count = "0";
                                _this.resultArray.push(statusPush)
                            }
                        }
                    }
                })
                .error(function() {
                    _this.assignedComplaints = 0;
                    _this.closedComplaints = 0;
                });
        }

        getComplaints(){
            var _this = this;
            this.ComplaintsList=[];
            this.getComplaint = true;
            this.respectiveComplaint = false;
            this.$http.get('/api/complaints/getComplaint')
            .success(function(data){
                _this.ComplaintsList = data;
            }).error(function(data){
                 //console.log(data);
            })
        }

        listComplaints(complaintType){
            var _this = this;
             this.getComplaint = false;
            this.respectiveComplaint = true;
            this.complaintType = complaintType;
            this.$http.post('/api/complaints/respectivecomplaint',{
                status:this.complaintType
            }).success(function(data){
              _this.ComplaintsList = data;
            }).error(function(data){
            })
        }
    }

    angular.module('guwhaApp')
        .component('employeedashboard', {
            templateUrl: 'app/employeedashboard/employeedashboard.html',
            controller: EmployeedashboardComponent,
            authenticate: true
        });

})();
