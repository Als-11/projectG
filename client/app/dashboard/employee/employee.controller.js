'use strict';
(function() {

    class EmployeeComponent {
        constructor($http, Auth, $location, NgTableParams, CommunityService, toastr, $uibModal, $document, $log) {
            this.$http = $http;
            this.$location = $location;
            this.toastr = toastr;
            this.NgTableParams = NgTableParams;
            this.CommunityService = CommunityService;
            this.employeeTable = new NgTableParams({
                page: 1,
                count: 5
            }, {
                dataset: []
            });
            this.searchresults = [];
            this.Auth = Auth;
            this.loggedInRole = this.Auth.getCurrentUser().role;
            this.employeeMethods();
            this.employeelist = [];
            this.val = 0;
            // this.prompt=prompt;
            this.$uibModal = $uibModal;
            this.$document = $document;
            this.$log = $log;
            this.animationsEnabled = true;

        }

        employeeMethods() {
            var a =new Date().getDate(); 
            var limiit = new Date().setDate(a-1);
            this.limit = new Date(limiit).toString();
            this.getEmployee();
            this.getCommunityName();
            this.employeeCount();
        }

        employeeCount() { //we get the all categories of employees count here
            this.employeeCategory = [];
            this.employeeCategory = ['SECURITY', 'GARDENING', 'PLUMBER', 'ELECTRICIAN', 'CARPENTRY', 'OTHERS'];
            var _this = this;
            this.employeeCategoryCount = [];
            this.$http.get('/api/employees/totalemployeecount')
                .success(function(data) { 
                    for (var i = 0; i < data.length; i++) {
                        for (i = 0; i < data.length; i++) {
                            for (var j = 0; j < _this.employeeCategory.length; j++) {
                                if (data[i].role === _this.employeeCategory[j]) {
                                    _this.employeeCategoryCount.push(data[i]);
                                }
                            }
                        }
                    }
                }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
        }

        employeeEdit(employeecard) {
            var _this = this;
            this.employeecard = employeecard;
            _this.employeeImage = employeecard.userinfo[0].imageUrl + '?_ts=' + new Date().getTime();
            console.log(_this.employeeImage);
        }

        employeeAssign(employeecard){
            var _this=this;
            this.employeeTypeComplaintsList=[];
            this.employeecard=employeecard;
            this.$http.post('api/complaints/employeeCategoryComplaints',{
                employeeType:this.employeecard.employeeType
            }).success(function(data){
                _this.employeeTypeComplaintsList=data; 
            }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
        }


         employeeCompliantAssign(employeeComplaintsList,employeecard) {
            var _this = this;
            //var row = {}; 
            this.employeecard=employeecard;
            this.employeeComplaintsList=employeeComplaintsList;
            this.$http.post('/api/complaints/assignCompliant', {
                assigned: this.employeecard.firstName,
                complaintId: this.employeeComplaintsList.complaintId,
                category: this.employeeComplaintsList.category,
                assingedId: this.employeecard.userId
            }).success(function(data) {
                _this.toastr.success('Complaint Assigned', 'Success');               
            }).error(function(data) {
                 _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
            });
            _this.employeeAssign(_this.employeecard);
        }



        populateEmployeeTable(selectedCategory) {
            this.employeeDetailsShow = true;
            var _this = this;
            this.selectedCategory = selectedCategory;
            this.employeeDetails = [];
            this.employeeDetailsList = [];
            this.$http.post('/api/employees/electriciansDetails',{
                selectedCategory:this.selectedCategory
            })
                .success(function(data) { 
                    console.log(data);
                    _this.employeeDetails = data;
                            for (var j = 0; j < _this.employeeDetails.length; j++) {
                                if (_this.employeeDetails[j].toDate == null || undefined) {

                                    _this.employeeDetails[j].status = 'active';
                                } else {

                                    _this.employeeDetails[j].status = 'away';
                                }
                            }
                }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
        }


        getEmail() { //we will get the emailid from the firstName and LastNam
            this.communityName = window.communityName;
            var res = this.communityName.replace(/ /g, "").toLowerCase(); //replaces spaces with "_" 

            if (this.employee.Firstname !== undefined && this.employee.Lastname !== undefined) {
                this.employee.EmailId = this.employee.Firstname + '_' + this.employee.Lastname + '@' +
                    res + '.com';
            }
        }



        getCommunityName() {
            this.CommunityService.getBlocks() //the getBlocks method in communityService returns a promise
                .success(function(data) {
                    window.communityName = data.communityName;
                }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
        }


        refreshTable(tableName, data) {
            switch (tableName) {
                case 'employeeTable':
                    this.employeeTable = new this.NgTableParams({
                        page: 1,
                        count: 5
                    }, {
                        dataset: data,
                        counts: []
                    });
            }
        }

        searchEmployeeTable() { //search in ng-employeetable
            if (this.userEnter !== '') {
                this.userEnters = this.userEnter.toLowerCase();
                var i = 0;
                for (; i < this.employeelist.length; i++) {
                    var firstName = this.employeelist[i].firstName.toLowerCase();
                    var result = firstName.startsWith(this.userEnters) ||
                        this.employeelist[i].phoneNumber.startsWith(this.userEnters);
                    if (result === true) {
                        this.searchresult = [];
                        this.searchresult = this.employeelist[i];
                        this.searchresults.push(this.searchresult);
                    }
                }
                this.refreshTable('employeeTable', this.searchresults); //push the selected rows
                this.searchresults = [];
            } else {
                this.refreshTable('employeeTable', this.employeelist);
            }
        }

        onRegister(form) {
            this.employadd = '';
            var _this = this; 
            var row = {};
            row.firstName = this.Firstname;
            row.phoneNumber = this.PhoneNumber;
             if(this.gender=="MALE"){
                   var imageUrl= 'http://steezo.com/wp-content/uploads/2012/12/man-in-suit2.jpg';
                }
                else{
                   var imageUrl= 'https://www.colourbox.com/preview/2324264-successful-business-woman-in-black-suit-over-white.jpg';
                }
            this.$http.post('/api/employees', {
                firstName: this.employee.Firstname,
                lastName: this.employee.Lastname,
                Gender: this.gender,
                emailId: this.employee.EmailId,
                occupation: this.employee.occupation,
                phoneNumber: this.employee.PhoneNumber,
                fromDate: this.employee.fromDate,
                imageUrl:imageUrl,
                salary: this.employee.salary,
                salaryDate: this.employee.salaryDate
            }).success(function(data) { 
                _this.employeeCount();
                _this.toastr.success('Employee Added Successfully!', 'Success');
                _this.employee = {};
                form.$setValidity();
                form.$setUntouched();

            }).error(function() {
                _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
            });
        }

        getEmployee() {
            var _this = this;
            this.$http.get('/api/employees')
                .success(function(data) {
                    _this.employeelist = data;
                });
        }

        removevalidationmessages() {
            var _this = this;
            _this.employsuccessshow = false;
            _this.employfailureshow = false;
        }

        cancelEdit(row) {
            var _this = this;
            _this.errorShow = false;
            this.populateEmployeeTable(row.employeeType);
            this.refreshTable('employeeTable', _this.employeeDetails);

        }

        setEmployeeToDate() {
            this.errorShow = false;
            var _this = this;
            if (this.editSalary == null || undefined) {
                this.editSalary = this.employeecard.salary;
            }
            if (this.editSalaryDate == null || undefined) {
                this.editSalaryDate = this.employeecard.salaryDate;
            }
            if (this.editPhoneNumber == null || undefined) {
                this.editPhoneNumber = this.employeecard.phoneNumber;
            }
            if (this.editToDate == null || undefined) {
                this.editToDate = this.employeecard.toDate;
            }
            this.$http.post('/api/employees/setToDate', {
                employeeId: this.employeecard.userId,
                salary: this.editSalary,
                phoneNumber: this.editPhoneNumber,
                toDate: this.editToDate,
                salaryDate: this.editSalaryDate
            }).success(function(data) {
                _this.populateEmployeeTable(_this.employeecard.employeeType);
                _this.refreshTable('employeeTable', _this.employeeDetails);
                _this.toastr.success('Employee Details Updated!', 'Success');
            }).error(function() {
                _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
            });

        }

    }

    angular.module('guwhaApp')
        .component('employee', {
            templateUrl: 'app/dashboard/employee/employee.html',
            controller: EmployeeComponent
        });

})();
