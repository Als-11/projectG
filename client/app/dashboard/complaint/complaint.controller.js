'use strict';
(function() {

    class ComplaintComponent {
        constructor($http, Auth, NgTableParams, toastr,$uibModal,$document,$log) {
            this.$http = $http;
            this.toastr = toastr;
            this.NgTableParams = NgTableParams;
            this.complaintsList = [];
            this.Auth = Auth;
            this.loggedInRole = this.Auth.getCurrentUser().role;
            this.assignedPersonList = [];
            this.toastr = toastr;
             this.loogedInrole =  this.Auth.getRole();
             // if(this.loggedInrole == undefined){
             //    this.toastr.warning('Something!Went Wrong,Please refresh the page')
             // }
            this.complaintsBackup=[];
            this.role = [];
            this.assaigne = [];
            this.result = [];
            this.employeeComplaintList = [];
            this.assaignShow = false;
            this.complaintmessageshow = false;
            this.$uibModal = $uibModal;
            this.$document = $document;
            this.$log = $log;
            this.animationsEnabled = true;
            this.getrole();
            this.complaintMethods();
            // this.getComments();
        }

        getrole() {
            if ( this.loogedInrole == "COMMUNITY_ADMIN") {
                this.getroles = 'false';
                this.totalComplaints = true;
                this.employeeComplaints = false; // Employee Role Specific Complaints
            } else if(this.loogedInrole == "RESIDENT") {
                window.getrole = 'RESIDENT';
                this.getroles = 'true';
              this.employeeCategory = ['SECURITY', 'GARDENING', 'PLUMBER', 'ELECTRICIAN', 'CARPENTRY', 'OTHERS'];
            }
        }

        complaintMethods() {
            this.getComplaints();
            this.listComplaints();
            this.complaintCount();
            this.getEmployees();
        }


        showCommentsBox(row) {
            this.complaintId = row.complaintId;
            this.showCommentBox = true;
        }

        complaintCount() {
            var _this = this;
            // var complaintDetails = [];
            _this.complaintCategory = [];
            this.employeList=[];
            _this.employeeType = [];
            _this.employeeCategory = ['SECURITY', 'GARDENING', 'PLUMBER', 'ELECTRICIAN', 'CARPENTRY', 'OTHERS'];
            this.$http.get('api/complaints/complaintCount')
                .success(function(data) {
                    _this.complaintDetails = data; 
                    for (var i = 0; i < _this.complaintDetails.length; i++) {
                        if(_this.complaintDetails[i].role==null||undefined){
                        }
                        else{
                            _this.employeList.push(_this.complaintDetails[i])
                        _this.employeeType.push(_this.complaintDetails[i].role);  //compatring 2 arrays
                    }

                    _this.complaintCategory = _this.employeList;
                        }
                        for(var i=0;i<_this.employeeCategory.length;i++){    // Zero case handleing
                           if(_this.employeeType.indexOf(_this.employeeCategory[i])==-1){
                              var employee ={}
                              employee.role = _this.employeeCategory[i];
                              employee.count = "0"
                             _this.complaintCategory.push(employee);
                            }
                        }
                }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
        }

         gettingEmployees(selectedCategory) {   //getting employee names based on the complaint category
            var _this = this;
            this.employeeData=selectedCategory;
            this.complaintDescription=selectedCategory.complaintdescription;
            this.selectedCategory = selectedCategory.category;
            this.status = selectedCategory.status; 
            if(this.status == "Assigned"){
                this.showAssignButton = false;
            }
            else {
                this.showAssignButton = true;
            }
            this.complaintId = selectedCategory.complaintId;
            _this.employeeDetails = [];
            this.$http.post('/api/employees/getRespectiveEmployees',{
                selectedCategory: this.selectedCategory,
                status:this.status,
                complaintId :this.complaintId
            })
            .success(function(data) {
                // alert("als"); 
                    for(var i=0;i<data.length;i++){
                          _this.employeeDetails.push(data[i]);
                    }
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

        assignedemployeName(details){
            var _this=this;
            _this.status=details.status;
            if(_this.status=="Assigned"){
            this.$http.post('/api/employees/assignedemployeName',{
                employeeId:details.employeeId
            }).success(function(data){
                _this.imageUrl=data[0].imageUrl + '?_ts=' + new Date().getTime();
                _this.employeename=data[0].firstName+' '+data[0].lastName;
                _this.employeePhoneNo=data[0].phoneNumber;
                _this.employeeId=details.employeeId;
                _this.designation=details.category;
            }).error(function(data){
                console.log(data);
            })
        }
        else{
            _this.message="Complaint Is Still Not Assigned";
        }

        }

        getOtherEmployees(categorys){
            var _this=this;
            _this.reassignEmployeeList=[];
            this.$http.post('/api/employees/getemployeeNames',{
                employeeType:categorys.category
            })
            .success(function(data){
                for(var i=0;i<data.length;i++){
                    if(data[i].userId!=categorys.assignedId){
                    _this.reassignEmployeeList.push(data[i]);
                }
                }
            }).error(function(data){
                console.log(data);
            })

        }

        searchEmployeeTable(){
            var _this = this;
            this.complaintsList = [];
            console.log(_this.complaintsBackup);
            if(this.searchEmployee == null || this.searchEmployee==undefined||this.searchEmployee==""){
                    _this.complaintsList = _this.complaintsBackup;               
            }
            else{
                this.$http.post('/api/complaints/suggestions', { keyword: this.searchEmployee }) //contains user selected community name
                    .success(function(data) {
                        _this.complaintsList = data;
                         for (var i = 0; i < data.length; i++) {
                            if(data[i].commentInfo.length>0){
                            for(var j=0;j<data[i].commentInfo.length;j++){
                                if(j==((data[i].commentInfo.length)-1)){
                                _this.commentsinfo=data[i].commentInfo[j].description;
                            }}
                        }
                        else{
                             _this.commentsinfo="No Comments";
                        }
                                _this.complaintsList[i].description=_this.commentsinfo;
                        
                        }
                    });
            }
        }

        employeeCompliantAssign(employeecards) {
            var _this = this;  
            this.$http.post('/api/complaints/assignCompliant', {
                assigned: employeecards.firstName,
                complaintId:  this.complaintId,
                category: employeecards.employeeType,
                assingedId: employeecards.userId,
                employeeId:employeecards.employeeId
            }).success(function(data) {
                _this.toastr.success('Complaint Assigned', 'Success'); 
                _this.complaintCount();  
                _this.listComplaints();    
            }).error(function(data) {
                 _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
            });
        }

        reAssignComplaint(reassigneeData){
             var _this = this;  
            this.$http.post('/api/complaints/assignCompliant', {
                assigned: reassigneeData.firstName,
                complaintId: this.complaintId,
                category: reassigneeData.employeeType,
                assingedId: reassigneeData.userId,
                employeeId:reassigneeData.employeeId
            }).success(function(data) {
                _this.toastr.success('Complaint Re-Assigned', 'Success'); 
                _this.complaintCount();  
                _this.listComplaints();    
            }).error(function(data) {
                 _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
            });
        }


        Createcomments() {
            var _this = this;
            // this.id = this.Auth.getCurrentUser().userId;
            this.$http.post('api/comments/commentsCreate', {
                complaintId: window.complaintId,
                description: this.commentsss
            }).success(function(data) { 
                _this.comments = data;
                _this.result.push(_this.comments);
            });
            _this.commentsss = null;
            this.complaintHistory(window.row);

        }


        pagination(x) {
            var _this = this;
            this.result = [];
            this.complaintNumber = window.complaintNumber;
            this.number = parseInt((x * 10) - 10); 
            this.$http.post('api/comments/getPagination', {
                    complaintNumber: this.complaintNumber,
                    page: this.number
                })
                .success(function(data) { 
                    _this.result = data;
                }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
        }


        onRegister(Title,Description) { //create a complaint from the resident
            var _this = this;
            // var row = {};
            // row.title = this.title;
            // row.complaintdescription = this.description;
            this.$http.post('/api/complaints', {
                title: Title,
                complaintdescription: Description,
                category: this.category
            }).success(function(data) { 
                _this.getComplaints();
                // row.complaintId = data.complaintId;
                // row.userName = data.userName;
                // row.status = 'Open';
                // _this.complaintsrow = row;
                // _this.complaintsList.push(_this.complaintsrow);
                // _this.refreshTable('complaintsTable', _this.complaintsList);
                _this.toastr.success('Submitted Your Complaint!', 'Success');
            }).error(function(data) {
                _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
            });
            this.title = null;
            this.description = null;
        }

        complaintHistory(compId) {
            var _this = this;
            // window.row = row;
            this.assignedmessage = false;
            this.assignederrormessage = false;
            this.complaintmessageshow = false;
            this.commentsHistoryShow = false;
            this.assaignShow = false;
            this.show = true;
            // window.complaintId = row.complaintId; 
            _this.complaintHistoryresult = [];
            this.$http.post('/api/historys/getComplaintHistory', {
                complaintId: compId
            }).success(function(data) { 
                _this.complaintHistoryresult = data; 
            }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });

        }



        getComplaints() { //based on the userId,displays the list of complaints(Resident)
            if (window.getrole === 'RESIDENT') {
                var _this = this;
                _this.commentssinfo=[];
                this.$http.get('/api/complaints')
                   .success(function(data) { 
                        for (var i = 0; i < data.length; i++) {
                            _this.complaintsList=data;
                            console.log(_this.complaintsList);
                            if(data[i].commentInfo.length>0){
                            for(var j=0;j<data[i].commentInfo.length;j++){
                                if(j==((data[i].commentInfo.length)-1)){
                                _this.commentssinfo.push(data[i].commentInfo[j].description);
                            }}
                        }
                        else{
                             _this.commentssinfo.push("No Comments");
                        }
                                _this.complaintsList[i].description=_this.commentssinfo[i];
                        
                        } 
                    }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });

            }
        }

        getEmployees() {
            var _this = this;
            this.$http.get('api/employees/getEmployees')
                .success(function(data) {
                    for (var i = 0; i < data.length; i++) {
                        _this.role = data;
                    }
                }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
        }


        // getComments(){ //get comments
        //     var _this=this;
        //     this.$http.get('api/complaints/getComments')
        //     .success(function(data){ 
        //     }).error(function(data){ 
        //     })
        // }

        listComplaints(selectedEmployeeCategory) { //based on the communityId,displays the list of complaints(admin)
            if (window.getrole !== 'RESIDENT') {
                var _this = this;
                _this.commentsinfo=[];
                _this.complaintsList = [];
                this.selemployeeCategory = selectedEmployeeCategory;
                if(selectedEmployeeCategory == undefined || selectedEmployeeCategory == null) {
                this.showallcomplaints = true;
                this.showRespectiveComplaints = false;
               }
               else
               {
                 this.showRespectiveComplaints = true;
                 this.showallcomplaints = false; 
               }
                this.$http.post('/api/complaints/listComplaints',{
                    employeeCategory:selectedEmployeeCategory
                })
                    .success(function(data) { 
                        _this.complaintsList=data;
                        _this.complaintsBackup= data;
                        for (var i = 0; i < data.length; i++) {
                            if(data[i].commentInfo.length>0){
                            for(var j=0;j<data[i].commentInfo.length;j++){
                                if(j==((data[i].commentInfo.length)-1)){
                                _this.commentsinfo=data[i].commentInfo[j].description;
                            }}
                        }
                        else{
                             _this.commentsinfo="No Comments";
                        }
                                _this.complaintsList[i].description=_this.commentsinfo;
                        
                        }
                        
                    }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });

            }
            }

            //automatically fills the assign complaint form
        // formfill(row) {
        //     this.assignedmessage = false;
        //     this.assignederrormessage = false;
        //     this.show = false;
        //     this.commentsHistoryShow = false;
        //     this.assaignShow = true;
        //     this.title = row.title;
        //     this.complaintdescription = row.complaintdescription;
        //     window.complaintId = row.complaintId;
        // }

        //populate the assigne dropdown based on the category
        // selectCatgory() {
        //     var _this = this;
        //     _this.assaigne = [];
        //     this.$http.post('api/employees/getemployeeNames', {
        //             employeeType: '' + this.employeeRole
        //         })
        //         .success(function(data) {
        //             // var emplyList = [];
        //             // var employList = [];
        //             // var employe;
        //             _this.emplyList = data; 
        //             for (var i = 0; i < _this.emplyList.length; i++) {
        //                 _this.employList = _this.emplyList;
        //                 _this.employe = _this.employList[i].firstName;
        //                 _this.assaigne.push(_this.employe);
        //             }

        //         });

        // }

        securityId() { //getting the assigned-securityId
            var i = 0;
            for (; i < this.emplyList.length; i++) {
                if (this.assignPerson === this.assaigne[i]) {
                    window.assingedId = this.employList[i].userId;
                    window.employeeId = this.employList[i].employeeId;

                }
            }

        }



        //assign the complant to the specfic person
        compliantAssign() {
            var _this = this;
            this.assignedmessage = false;
            this.assignederrormessage = false;
            if (this.comment === null) {
                this.admincomment === null;
            } else {
                this.admincomment = this.comment;
            }
            //var row = {};
            this.$http.post('/api/complaints/assignCompliant', {
                assigned: this.assignPerson,
                description: this.admincomment,
                complaintId: window.complaintId,
                category: this.employeeRole,
                assingedId: window.assingedId,
                employeeId:window.employeeId
            }).success(function(data) {
                _this.listComplaints(employeeRole);
                _this.toastr.success('Complaint Assigned', 'Success');
            }).error(function(data) {
                _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
            });
            // this.listComplaints();
            this.complaintCount();
            this.assignPerson = null;
            this.employeeRole = null;
            this.comment = null;
            this.assaignShow = false;

        }

        refreshTable(tableName, data) {
            if (window.getrole === 'RESIDENT') {
                this.complaintsTable = new this.NgTableParams({
                    page: 1,
                    count: 5
                }, {
                    dataset: data,
                    counts: []
                });
            } else {
                this.complaintsTable = new this.NgTableParams({
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
        .component('complaint', {
            templateUrl: 'app/dashboard/complaint/complaint.html',
            controller: ComplaintComponent
        });

})();