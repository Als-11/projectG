'use strict';
(function() {

    class ServicesdashboardComponent {
        constructor(Auth, $http,toastr,$rootScope,$location) {   
            this.Auth = Auth;
            this.$rootScope = $rootScope;
            this.$http = $http;
            this.$location = $location;
            this.toastr= toastr;
            this.result = false;
            // this.communityInfo();
            this.getReqCommunities();
            this.approveCommCount();
            this.getBrands();
            this.getlastMonthSlaes();
            this.$rootScope.globalFirstName = this.Auth.getCurrentUser().firstName;
           this.$rootScope.role =  this.Auth.getRole();
            if (this.Auth !== undefined && this.Auth.isLoggedIn() === true) {
            } else {
                this.$location.path('/');
            }
          }


          getlastMonthSlaes(){
            var _this = this;
            this.$http.get('api/serviceRequests/getlastMonthSlaes')
          }

          approveCommCount(){   //approve and decline the Communities Count
            var _this = this;
            this.statusArray = ["APPROVED","REJECTED","PENDING"];
            this.communityCountArray = [];
            this.communityStatus = [];
            this.$http.get('/api/servProvRegists/approveCommCount')
            .success(function(data)
            { 
               for(var i=0;i<data.length;i++){
                var commStatus = {}
                 commStatus.status = data[i]._id.status;
                 commStatus.count = data[i].count;
                 _this.communityCountArray.push(commStatus);
                 _this.communityStatus.push(data[i]._id.status)
                }
                for(var i=0;i<_this.statusArray.length;i++){
                     if(_this.communityStatus.indexOf(_this.statusArray[i])== -1)
                     {
                         var pushstatus = {};
                        pushstatus.status = _this.statusArray[i];
                         pushstatus.count = "0";
                        _this.communityCountArray.push(pushstatus);
                     }
                    }
            
            }).error(function(data)
            {
                _this.communityCountArray[0].count = 0;
                _this.communityCountArray[1].count = 0;
                _this.communityCountArray[0]._id.status  = "APPROVED";
                 _this.communityCountArray[1]._id.status  = "Declined";
 
            })
          } 

      getBrands() {     //getting the brand Counts
        var _this = this;
            this.$http.get('/api/typesForServices/getBrandCount')
            .success(function(data)
            {
              console.log(data);
               _this.getBrandsArray = data;
            })
             .error(function(){
                 _this.getBrandsArray = 0;
            })
        }

          getReqCommunities(){
            var _this = this;
            _this.getReqCommunity = [];
            this.$http.get('/api/servProvRegists/getReqCommunities')
            .success(function(data)
            {
              console.log(data);
              _this.getReqCommunity = data;
            })
            .error(function(data)
            {
               console.log(data);
            })
          }


          path(Comunity){
            var _this = this;
            this.status = Comunity.status; 
            if(   this.status == "APPROVED"){
              _this.$location.path('/servicesdashboard/approvedcommunities')
            }
            else if(this.status == 'REJECTED'){
               _this.$location.path('/servicesdashboard/declinecommunities')
            }
            else if( this.status == "PENDING"){
              _this.$location.path('/servicesdashboard/pendingcommunities')
            }
          }

          brandRedirect(){
            var _this = this;

               _this.$location.path('/servicesdashboard/brands')
          }

          
        communityInfo(){           //provider view to the list of communities
            var _this = this;
            _this.communityInfo = [];
            this.$http.get('/api/community/getcommunity')
            .success(function(data)
            {
                console.log(data);
                _this.communityInfo = data; 
                 _this.getReqCommunities();
            }).error(function(data)
            {
                _this.communityInfo="Sorry,No Communities are Their!!!"
            })
        }

        raiseRequest(communityInfo){            //serviceprovider request to the admin
             var _this = this;
             this.$http.post('/api/servProvRegists/request',{
                communityId:communityInfo.communityId
             }).success(function(data)
             {
                 _this.toastr.success('Wait for approval!', 'Request Placed Successfully');
                         for(var i=0;i<_this.communityInfo.length;i++) {
                            if(_this.communityInfo[i].communityId == communityInfo.communityId)  {
                                   _this.communityInfo.splice(i, 1);
                            }
                         }

                 _this.approveCommCount();
                 _this.getReqCommunities();

             }).error(function(data)
             {
               _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
             })
        }



        servicesForm() {
            var _this = this;
            if (this.selectedService == undefined) {
                this.saveButton = false;

            } else {
                this.serviceForm = true;
                this.saveButton = true;
                this.$http.post('/api/services/getServiceId', {
                    selectedCategory: this.selectedService
                }).success(function(data) {
                    _this.serviceId = data.serviceId 
                }).error(function(data) {
                    _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
                })
            }
        }

        // saveServiceType() {
        //     var _this = this;
        //     this.$http.post('/api/typesForServices/save', {
        //         name: this.serviceName,
        //         description: this.description,
        //         unitPrice: this.unitPrice,
        //         quantity: this.quantity,
        //         serviceId: this.serviceId
        //     }).success(function(data) {
        //         _this.toastr.success('Wait for approval!', 'Request Placed Successfully');

        //     }).error(function(data) {
        //         _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
        //     })

        // }
        
    }

    angular.module('guwhaApp')
        .component('servicesdashboard', {
            templateUrl: 'app/servicesdashboard/servicesdashboard.html',
            controller: ServicesdashboardComponent,
            authenticate: true
        });

})();
