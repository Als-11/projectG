'use strict';
(function() {

    class VisitorsComponent {
        constructor(Auth, $location, $http, NgTableParams, CommunityService, socket,toastr) {
            this.socket = socket;
            this.$http = $http;
            this.toastr= toastr;
            this.$location = $location;
            this.datset = [];
            this.data = [];
            this.blocksList = [];
            this.timeFrom = '10.00';
            this.Auth = Auth;
            this.outtime = [];
            this.employeeType = "SECURITY";//showing the  visitors in side-navbar
            this.CommunityService = CommunityService;
            this.NgTableParams = NgTableParams; //creating a instance for NgTableParams 
            this.visitorsTable = new NgTableParams({
                page: 1,
                count: 1
            }, {
                dataset: []
            });
            this.visitorsCount = new NgTableParams({
                    page: 1,
                    count: 5
                },{
                    dataset : []
                });
            this.result =[];
            this.visitorslist = [];
            this.usersLeft = [];
            this.User = this.Auth.getCurrentUser();
            this.firstName = this.Auth.getCurrentUser().firstName;
            this.communityId = this.Auth.getCurrentUser().communityId;
            if (this.Auth !== undefined && this.Auth.isLoggedIn() === true) {
                // Welcome sir you are logged in=

            } else {
                // Sorry trespassers not allowed
                this.$location.path('/');
            }
            this.visitorMethods();
        }


        visitorMethods(){
             this.selectedBlocks();
            // this.getTime();
            // this.visitorsLeft();
            this.getVisitors();
            this.socket.syncUpdates('visitor', this.visitorslist);
            this.searchresults = [];
        }

        // getTime(){            
        //     this.CurrentIntime = new Date();
        //     window.CurrentIntime = this.CurrentIntime;

        // }

        // here we refresh table for every action done on ngtable
        // refreshTable(tableName, data) {
        //     switch(tableName){
        //         case 'visitorTable':
        //         this.visitorTable = new this.NgTableParams({
        //                 page: 1,
        //                 count: 5,
        //                 sorting: { flatNo: 'desc' }
        //             }, {
        //                 dataset: data,
        //                 counts: []
        //             });
        //         break;

        //         case 'visitorsCount' : 
        //             this.visitorsCount = new this.NgTableParams({
        //             page : 1,
        //             count : 5
        //             }, {
        //                 dataset : data,
        //                 counts  :[]

        //             });
        //     }
                    
        // }



        searchVisitorTable() { //search in visitors table
    var _this = this
    this.searchresults = [];
    if (this.searchtext !== '') {
        var i = 0;
        this.searchtext = this.searchtext.toLowerCase();

        for (; i < this.visitorslist.length; i++) {
            var date = new Date(this.visitorslist[i].inTime).getDate()+'-'+(new Date(this.visitorslist[i].inTime).getMonth()+1)+'-'+
            new Date(this.visitorslist[i].inTime).getFullYear();
            var visitorname = this.visitorslist[i].name.toLowerCase();
            var flatsnumber = this.visitorslist[i].flatNo;
            var vehiclenumber = this.visitorslist[i].vehicleNo;
            var outtimes =  new Date(this.visitorslist[i].outTime).getDate()+'-'+(new Date(this.visitorslist[i].outTime).getMonth()+1)+'-'+
            new Date(this.visitorslist[i].outTime).getFullYear();
            if(outtimes!=null){
            var result = date.startsWith(this.searchtext) ||
                visitorname.startsWith(this.searchtext) ||
                flatsnumber.startsWith(this.searchtext) ||
                vehiclenumber.startsWith(this.searchtext) ||
                outtimes.startsWith(this.searchtext);
            }
            else{
                var result = date.startsWith(this.searchtext) ||
                visitorname.startsWith(this.searchtext) ||
                flatsnumber.startsWith(this.searchtext) ||
                vehiclenumber.startsWith(this.searchtext)
            }
            if (result === true) {
                this.searchresult = [];
                this.searchresult = this.visitorslist[i];
                this.searchresults.push(this.searchresult);
            }
            console.log(this.searchresults);

        }
        this.visitorslist=this.searchresults;


    } else {
        this.searchresults = [];
        _this.getVisitors();
    }

}


               

        //here we get the visitors and populate the ngtable
        getVisitors() {
            var _this = this;
            this.$http.get('/api/visitors')
                .success(function(data) {
                    console.log(data);
                    _this.visitorslist = data;
                })
                .error(function(){
                    _this.toastr.error("sorry! Something Went Wrong");
                });
        }

        visitorsLeft(visitDetails) {
            var _this = this;
            this.$http.post('/api/visitors/visitors',{
                visitorId: visitDetails.visitorId
            })
            .success(function(data)
            {
                _this.getVisitors();
            })
            .error(function(){
                _this.toastr.error("sorry! Something Went Wrong");
            });
        }


        selectedBlocks() {
            var _this = this;
            this.CommunityService.getBlocks() //the getBlocks method in communityService returns a promise 
                .success(function(data) {
                	_this.blocksList = data.blocks;
                    
                })
                .error(function(){
                    _this.toastr.error("sorry! Something Went Wrong");
                });
        }

       	 
        flatNumbers() { //flatNumber Search
            this.resultFlatNumberArray = [];
             this.communityId = this.Auth.getCurrentUser().communityId;
                var _this = this;
                this.$http.post('/api/floors/suggestions', 
                { keyword: this.flatNumber,
                communityId: this.communityId 
                }) //contains user selected community name
                    .success(function(data) {
                        console.log(data);
                        var i = 0;
                        for (; i < data.length; i++) {
                            _this.resultFlatNumberArray.push(data[i].blockName + '-' + data[i].flatNumber);
                            //pushes the communityName, address1 and Locality to the user in search box
                        }
                    });
            }


        floorNumber(){
        	this.selectedFloorNumber =[];
        	this.selectedFloorNumber =  this.flatNumber.split('-');
        	window.blockName = this.selectedFloorNumber[0];
        	window.flatNumbers = this.selectedFloorNumber[1];
            this.setVisitor();
        }


        setVisitor() {
            var _this = this;
            this.$http.post('api/users/setVisitor',{
                houseNumber: this.flatNumber
            }).success(function(data) {
                _this.userId = data.userId;
            });
        }

        addVisitor() {
            var _this = this;
            if((this.name!=null||this.name!=undefined)&&
                (this.flatNumber!=null||this.flatNumber!=undefined)&&
                (this.phoneNumber!=null||this.phoneNumber!=undefined)&&
                (this.purpose!=null||this.purpose!=undefined) ){
                if( window.blockName==undefined){
                    _this.toastr.warning('Give Valid Flat Number!', 'Warning');
                }
                else{
                    var vehicleNo=this.vehicleNo;
            // this.getTime();
            this.$http.post('/api/visitors/create', {
                name: this.name,
                phoneNumber: this.phoneNumber,
                blockName: window.blockName,
                alongWith : this.alongWith,	  
                // floorNumber: this.floors.floorNumber,
                flatNo: window.flatNumbers, 	
                 purpose: this.purpose,
                vehicleNo: vehicleNo,
                userId:this.userId
                // inTime: this.CurrentIntime,
                // outTime:this.outTime
            }).success(function(data) {
                _this.visitorslist.push(data);
                _this.getVisitors();
                _this.successMessage=true;
                _this.name =null;
                _this.phoneNumber =null;
                _this.flatNumber = null;
                _this.purpose =null;
                _this.vehicleNo = null;
                _this.alongWith = null;

                _this.toastr.success('Visitor Added !', 'Success');  
            }).error(function( ) {
                _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
            });
        }
        }
        else{
            _this.toastr.warning('Fill All The Fields!', 'Warning');
        }

        }

    }

    angular.module('guwhaApp')
        .component('visitors', {
            templateUrl: 'app/employeedashboard/visitors/visitors.html',
            controller: VisitorsComponent
        });

})();
