'use strict';
(function() {

    class UserServicesComponent {
        constructor($http, Auth, toastr,uiCalendarConfig,$location,$rootScope) {
            this.$http = $http;
            this.$location = $location;
            this.$rootScope = $rootScope;
            this.toastr = toastr;
            this.uiCalendarConfig = uiCalendarConfig;
            this.Auth = Auth;
            this.user = this.Auth.getCurrentUser();
            // this.services();
            this.getServices();
            // this.serviceproviderDetails();
            this. listOfServices();
            if (this.user.role !== "RESIDENT" ) {
            this.$location.path('/');
          }
      
          // this.getCalender();
        }




        getServices() {          //Getting available services from particular community 
            this.availableServices = [];
            this.availServiceNames = [];
            var _this = this;
            this.$http.get('/api/services/getServices')
                .success(function(data) { 
                    for (var i = 0; i < data.length; i++) {
                        _this.availableServices.push(data[i].serviceCategory);
                        _this.availServiceNames.push(data[i].serviceName);
                    }
                    console.log(_this.availableServices)
                }).error(function(data) { 
                    _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
                })
        }

   listOfServices() { //getting the user Adapt Services
    var _this = this;
     _this.listOfServicesArray = [];
    this.$http.get('/api/serviceRequests/listServices')
    .success(function(data)
    {
      _this.listOfServicesArray = data;
    }).error(function(data) { 
        _this.toastr.error("Sorry! Something Went Wrong");
    });
   }

  
   serviceproviderDetails(user) {   
    var _this = this;
   this.serviceId = user;
   this.selSerproId = user;
    // this.serviceproviderId = user._id.serviceProviderId;
    // _this.serviceProviderArray = []; 
    this.$http.post('/api/serviceProviderDetails/serviceproviderDetail',{
        serviceId:  this.serviceId
    }).success(function(data)
    {
      console.log(data);
        _this.serviceProviderArray = data; 
    }).error(function(data) { 
        _this.toastr.error("Sorry! Something Went Wrong");
    });

   }
   
getTypeServices(serviceApprovals) {   //getting the services types based on the service Category
      var _this = this;  
      this.serviceProviderId = serviceApprovals._id.serviceProviderId;
      this.serviceRegistrationForm = true;
      // this.userSelctedServiceCat = serviceTypes;
      _this.serviceTypArray = [];
      this.$http.post('/api/serviceProviderDetails/getSelectedBrands',{
        serviceProviderId:serviceApprovals._id.serviceProviderId,
      serviceCategory:this.serviceId
      }).success(function(data)
      { 
         console.log(data);
          for(var i=0;i<data.length;i++){
          var brandName =  data[i]._id.ToTalBrands[0].brandName;
            var quantity  = data[i]._id.ToTalBrands[0].quantity;
              var service = brandName+','+quantity;
             _this.serviceTypArray.push(service)
          }
      }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
   }


 typeSerInfo()//getting user selected serviceType info
   {
    var _this = this; 
    this.selectedService = this.typeService.split(',');
    this.$http.post('/api/typesForServices/userSelSertype',{
      name:this.selectedService[0],
      quantity:this.selectedService[1],
      serviceProviderId:this.serviceProviderId,
      serviceId:this.serviceId
    }).success(function(data)
    {
        // for(var i=0;i<dat)
        _this.UnitPrice = data[0].unitPrice;
        _this.typeId = data[0].typeId; 
    }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
   }

        getTotalCost() //get the cost based on the quantity
            {
                this.totalCost = this.quantity * this.UnitPrice;
            }


        
   userSaveService() //saved the userselected Service
   {
    console.log(this.fromDate);
    console.log(this.toDate);
     var _this  = this;
     this.from = new Date(this.fromDate)
     var fromDate = this.from.getDate();
     console.log(fromDate);
     this.to = new Date(this.toDate);
     console.log(this.to);
     this.endDate = this.to.getDate();
     console.log(this.endDate);
     var dateFrom =new Date(this.fromDate);
      var dateTo =new Date(this.toDate);
      var Delivery = (dateTo-dateFrom);
      console.log(Delivery);
       this.deliveryDay = Delivery/(86400000);
      this.deliveryDays = parseInt(this.deliveryDay+1);
      console.log(this.deliveryDays);
      var dateSet = dateFrom.getDate();
         this.$http.post('/api/serviceRequests/userServices',{
               deliveryDays :this.deliveryDays,
               serviceProviderId: this.serviceProviderId,
               serviceCategory:this.serviceId,
                units:this.quantity,
                totalCost:this.totalCost,
                fromDate:this.fromDate,
                toDate:this.toDate,
                customTypeId:this.typeId,
                 Servicename: this.selectedService

     }).success(function(data)
     {
         _this.userSelectedService = true;
         _this.totalCost =null;
         _this.fromDate =null;
         _this.toDate =null;
         _this.quantity =null;
         _this.UnitPrice =null;
         _this.typeService =null;
         _this.toastr.success("Your Services Requests Raised Successfully")
     }).error(function(data)
     {
           _this.toastr.success("Sorry!Something went wrong")
     })
          
   }

}
    angular.module('guwhaApp')
        .component('userservices', {
            templateUrl: 'app/dashboard/userservices/userservices.html',
            controller: UserServicesComponent
        });

})();
