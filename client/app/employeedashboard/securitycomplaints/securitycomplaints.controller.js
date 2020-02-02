'use strict';
(function() {

    class SecuritycomplaintsComponent {
        constructor(Auth, $http, NgTableParams, toastr, CommunityService) {
            this.Auth = Auth;
            this.$http = $http;
             this.toastr= toastr;
            this.CommunityService = CommunityService;
            this.NgTableParams = NgTableParams;
            this.complaintsTable = new NgTableParams({
                page: 1,
                count: 5
            }, {
                dataset: []
            });
            this.securityComplaintMethods();
        }



        securityComplaintMethods() {
            this.assignedComplaints();
            this.getEmployeeType();
        }


        getEmployeeType() {
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

        assignedComplaints() {
            var _this = this;
            this.$http.get('/api/complaints/respectivePerson')
                .success(function(data) {
                    _this.assignedComplaintsList = data; 
                    _this.refreshTable('complaintsTable', _this.assignedComplaintsList);

                })
                .error(function(){
                     _this.toastr.error("sorry! Something Went Wrong");
                });
        }


        refreshTable(tableName, data) {
            this.complaintsTable = new this.NgTableParams({
                page: 1,
                count: 5
            }, {
                dataset: data,
                counts: []
            });

        }
    }



    angular.module('guwhaApp')
        .component('securitycomplaints', {
            templateUrl: 'app/employeedashboard/securitycomplaints/securitycomplaints.html',
            controller: SecuritycomplaintsComponent
        });

})();
