 'use strict';
 (function() {

     class AmenitiesBookingComponent {
         constructor($http, $location, Auth, NgTableParams, CommunityService,toastr) {
             this.$http = $http;
             this.$location = $location;
             this.Auth = Auth;
             this.toastr = toastr;
             // this.loggedInRole = this.Auth.getCurrentUser().role;
             this.NgTableParams = NgTableParams;
             this.bookingTable = new NgTableParams({
                 page: 1,
                 count: 5
             }, {
                 dataset: []
             });
             this.amenitylist = [];
            this.loogedInrole =  this.Auth.getRole();
             this.startTimebuttonValue = [];
             this.endTimebuttonValue = [];
             this.buttonval = [];
             this.getAmentiesBookingList = [];
             this.booking = [];
             this.CommunityService = CommunityService;
             this.amenitiesBookingMethods();
              this.bookingHistorys();

         }

         amenitiesBookingMethods() {
             this.getrole();
             this.getAmenties();
             var a =new Date().getDate(); 
            var limiit = new Date().setDate(a-1);
            this.limit = new Date(limiit).toString();
            this.indexesArray=[];
         }

         bookingHistorys() {
            var _this = this;
            this.bookingHistory = [];
            this.$http.get('/api/amenitiesbookings/bookingHistory')
                .success(function(data) {
                    _this.bookingHistory = data;
                    _this.nodata = "";
                }).error(function(data) {
                    _this.nodata = "No previous Bookings"
                })
        }

         getrole() {
             this.role = this.Auth.hasRole('COMMUNITY_ADMIN');
             if ( this.loogedInrole === 'COMMUNITY_ADMIN') {
                 this.getroles = 'false';
                 this.latestBookings(); //if communityAdmin than only we invoke this method
             } else if(this.loogedInrole === 'RESIDENT'){
                 window.getrole = 'RESIDENT';
                 this.getroles = 'true';
             }
         }

         refreshTable(tableName, data) {
             switch (tableName) {
                 case 'bookingTable':
                     this.bookingTable = new this.NgTableParams({
                         page: 1,
                         count: 5
                     }, {
                         dataset: data,
                         counts: []
                     });
             }
         }

         getAmenties() { //get amenties based on the communityId
             var _this = this;
           this.$http.get('/api/amenities/getAmenityNames') 
                 .success(function(data) {
                    for(var i=0;i<data.length;i++){
                     _this.amenitylist.push(data[i].amenityName);
                    }
                 }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
         }

          getAmenityDetails() {  //get respective amenity details
          var _this = this;
          this.$http.post('/api/amenities/getAmenityDetail',{
            amenityName:this.amenityName
          }).success(function(data)
          {
              _this.timeInterval = data.timeInterval;
              _this.bookingStartsFrom = data.availableBookFrom
              _this.bookingTo = data.availableBookTo;
              _this.amenityId = data.amenityId;
          }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });

         }


         latestBookings() { //for communityAdmin show laest bookings
             var _this = this;
             this.latestBookingsTable = [];
             this.$http.get('/api/amenitiesbookings/latestBooking')
                 .success(function(data) {
                     _this.latestBookingsTable = data; 

                 }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
         }

         getBookings() {
             this.amenitybookshow = false;
             this.buttonsShow = true;
               this.buttonsGeneration = [];
               this.buttoncolour=[];
                this.solution = [];
             if(this.timeInterval == 'day'){
                  var startTime = 0;
                  var endTime = 24; 
                var  snumber = parseInt(startTime);
               var endNumber = parseInt(endTime);
              }
              else{
            var sTime = moment(this.bookingStartsFrom, ["h:mm A"]) 
                var eTime =  moment(this.bookingTo, ["h:mm A"])

                var startTime =sTime._d.getHours()
                var endTime = eTime.format("HH");
               var  snumber = parseInt(startTime);
               var endNumber = parseInt(endTime);
           }
         
             if(this.timeInterval == 'hourly'){
                this.hourbuttonsShow = true; 
                this.daybuttonsShow = false;
                var i = snumber;
                 for(; i < endNumber; i++) { //button generation loop for hourly
                    var timeSlot = {};
                 timeSlot.time = i + '-' + '' + (i + 1);
                 timeSlot.status = false;
                 this.buttonsGeneration.push(timeSlot);
               } 
               this.solution =  this.buttonsGeneration;
               for(var j=0;j<this.solution.length;j++){
               this.solution[j].colours="#2ec0d4";
               } 
            }
            else if(this.timeInterval == '3Hours'){
                 this.hourbuttonsShow = true;
                 this.daybuttonsShow = false;
                var i = snumber; 
                 for(; i < endNumber; i=i+3) { //button generation for 3 hours
                    var timeSlot = {};
                    if((i+3) <= endNumber)
                    {
                 timeSlot.time = i + '-' + '' + (i + 3);
             }
                    else{
                            timeSlot.time = i + '-' + '' + endNumber;
                    }
                 timeSlot.status = false;
                 this.buttonsGeneration.push(timeSlot);
               } 
               this.solution =  this.buttonsGeneration;
               for(var j=0;j<this.solution.length;j++){
               this.solution[j].colours="#2ec0d4";
               } 
            }
            else if(this.timeInterval == '6hours'){
                 this.hourbuttonsShow = true;
                 this.daybuttonsShow = false;
                var i = snumber;
                 for(; i < endNumber; i=i+6) { //button generation for 6 hours
                    var timeSlot = {};
                    if((i+6) <= endNumber){
                 timeSlot.time = i + '-' + '' + (i + 6);
             }
             else{
                 timeSlot.time = i + '-' + '' + endNumber;
             }
                 timeSlot.status = false;
                 this.buttonsGeneration.push(timeSlot);
               } 
               this.solution =  this.buttonsGeneration;
               for(var j=0;j<this.solution.length;j++){
               this.solution[j].colours="#2ec0d4";
               } 
            }
            else if(this.timeInterval == 'day'){
                 this.daybuttonsShow = true;
                this.hourbuttonsShow = false;
                var i = snumber;


                 for(; i < endNumber; i=i+24) { //button generation for 6 hours
                    var timeSlot = {};
                 timeSlot.time = 0  +'-' + '' + (0);        //for a day 
                 timeSlot.status = false;
                 this.buttonsGeneration.push(timeSlot);
               } 
                 this.solution =  this.buttonsGeneration;
                 for(var j=0;j<this.solution.length;j++){
                    this.solution[j].colours="#2ec0d4";
                } 
            }

            var _this = this; 
             this.$http.post('/api/amenitiesbookings/getBookings', {
                 startDate: this.startDate,
                 amenityId: this.amenityId
             }).success(function(data) {
                  _this.booking = [];
                  _this.booking = data; 
                     for (var i = 0; i < _this.booking.length; i++) {
                         _this.blockedFrom = new Date(_this.booking[i].blockedFrom);
                         _this.blockedTo = new Date(_this.booking[i].blockedTo);
                         _this.blockedTimes = _this.blockedFrom.getHours() + '-' + _this.blockedTo.getHours();
                         for (var j = 0; j < _this.solution.length; j++) {
                             if (_this.solution[j].time === _this.blockedTimes) {
                                 _this.solution[j].status = true ;
                                 _this.solution[j].colours="#A9A9A9";  
                         }
                     }
                }
             }).error(function() {
                 _this.solution = [];
                 for (var z = 0; z < _this.buttonsGeneration.length; z++) {
                     _this.solution.push(_this.buttonsGeneration[z]);
                 }
             });
     }

         bookAmenity(x,index) { //booking the amenity 
             var _this = this;
             this.time = x.time.split('-'); 
             this.startTime = this.time[0];
             this.endTime = this.time[1]; 
             this.indexesArray.push(index);
             if(index==undefined){
                _this.solution[0].colours="#5cb85c";
             }
             else{
                _this.solution[index].colours="#5cb85c";
             }
             this.startTimebuttonValue.push(this.startTime);
             this.endTimebuttonValue.push(this.endTime);
         }

         cancelTimBook() { //cancel the time anfd choose anothertime
             var _this = this;
             for (var k = 0; k < _this.indexesArray.length; k++) {
                 for (var j = 0; j < 10; j++) {
                     if (_this.indexesArray[k] == j) {
                         _this.solution[j].colours = "#2ec0d4";
                     }
                 }
             }
             this.indexesArray=[];
             this.buttonval = [];
             this.startTimebuttonValue = [];
             this.endTimebuttonValue = [];
             this.startTime = null;
             this.endTime = null;
         }

         makeBooking() {
             this.buttonval = [];
             var _this = this;
             for (var i = 0; i < this.startTimebuttonValue.length; i++) { //here we  break the slots
                 this.startBookingTime = this.startTimebuttonValue[i];
                 this.endBookingTime =this.endTimebuttonValue[i];
                 this.$http.post('/api/amenitiesbookings/bookingAmenity', {
                     startDate: this.startDate,
                     amenityId: this.amenityId,
                     startTime: this.startBookingTime,
                     endTime: this.endBookingTime
                 }).success(function(data) {
                     _this.getBookings();
                     _this.latestBookings();
                     _this.bookingHistorys();
                     _this.amenitybookshow = true;
                     _this.startTime = null;
                     _this.endTime = null;
                     _this.toastr.success('Successfully Booked Your Solt With Booking ID '+ data.bookingId, 'Success');
                 }).error(function(data) { 
                     _this.toastr.error('Sorry Something Went Wrong ', 'Failed');
                 })
             }
             this.indexesArray=[];
             _this.startTimebuttonValue = [];
             _this.endTimebuttonValue = [];
         }

         amenityApproved(user) {
             var _this = this;
             this.amenitySelected = user; 
             var amenityId=this.amenitySelected._id.AmenityInfo[0].amenityId;
             var bookingId=this.amenitySelected._id.bookingId;
             this.$http.post('api/amenitiesbookings/amenityApproved', {
                 amenityId: amenityId,
                 bookingId: bookingId
             }).success(function(data) {
                 for (var i = 0; i < _this.latestBookingsTable.length; i++) {
                     if (_this.latestBookingsTable[i].bookingId === user.bookingId) {
                         _this.latestBookingsTable.splice(i, 1);
                         break;
                     }
                 }
                 _this.toastr.success('Slot Approved For Booking Id @"' + user.bookingId, 'Success');

             }).error(function(data) {
                _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
             })
         }

         amenityDecline(user) {
             var _this = this;
             this.amenitySelected = user; 
             var amenityId=this.amenitySelected._id.AmenityInfo[0].amenityId;
             var bookingId=this.amenitySelected._id.bookingId;
             this.$http.post('api/amenitiesbookings/amenityDeclined', {
                 amenityId: amenityId,
                 bookingId: bookingId
             }).success(function(data) {
                 for (var i = 0; i < _this.latestBookingsTable.length; i++) {
                     if (_this.latestBookingsTable[i].bookingId === user.bookingId) {
                         _this.latestBookingsTable.splice(i, 1);
                         break;
                     }
                 }
                 _this.toastr.Warning('Slot Declined For Booking Id @"' + user.bookingId, 'Warning');
             }).error(function(data) {
                _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
             })
         }
     }

     angular.module('guwhaApp')
         .component('amenitiesbooking', {
             templateUrl: 'app/dashboard/amenitiesbooking/amenitiesbooking.html',
             controller: AmenitiesBookingComponent
         });

 })();
