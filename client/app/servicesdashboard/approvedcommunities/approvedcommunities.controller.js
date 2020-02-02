'use strict';
(function() {

    class ApprovedCommunitiesComponent {
        constructor(Auth, $location, $http,toastr) {
            this.$http = $http;
             this.toastr =  toastr;
            this.$location = $location;
            this.Auth = Auth;
           this.approvedCommunities();
           // this.getServices();
        }

        approvedCommunities() {
            var _this = this;
             _this.comunitynames = [];
            this.$http.get('api/serviceProviderDetails/appCommName')
            .success(function(data)
            {
                _this.comunitynames = data; 
            }).error(function(data)
            { 
                _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
            })
        }
        serviceTypeRequest(){      //showing the service form 
               this.serviceForm = true;
        }

        // servicesForm() {    //getting the service id(user serlected category)
        //     var _this = this;
        //     this.$http.post('/api/services/getServiceId',{
        //         serviceCategory:this.selectedService
        //     }).success(function(data)
        //     { 
        //         _this.serviceId = data.serviceId;
        //     }).error(function(){
        //         _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
        //     })
        // } 


        // getServices() {          //Getting available services from particular community 
        //     this.availableServices = [];
        //     this.availServiceNames = [];
        //     var _this = this;
        //     this.$http.get('/api/services/getServices')
        //         .success(function(data) { 
        //             for (var i = 0; i < data.length; i++) {
        //                 _this.availableServices.push(data[i].serviceCategory);
        //                 _this.availServiceNames.push(data[i].serviceName);
        //             }
        //         }).error(function(data) { 
        //             _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
        //         })
        // }


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
        .component('approvedcommunities', {
            templateUrl: 'app/servicesdashboard/approvedcommunities/approvedcommunities.html',
            controller: ApprovedCommunitiesComponent
        });

})();
