'use strict';
(function(){

class ServicesComponent {
  constructor($http,Auth) {
     this.$http = $http;
     this.Auth = Auth;
           this.loggedInRole = this.Auth.getCurrentUser().role;
     this.result = false;
     this.servicesMethods();
   }

   servicesMethods(){
    this.serDetails();
    // this.servTypeApproval();
   }


displayService(servName,servCategory){
    var _this = this;
    this.servceName = servName;
    this.servceCategory =servCategory; 
    this.servDetailsShow = true;
    this.servProvNames = [];
    this.servId;
    this.$http.post('api/services/servDetails',{
        serviceName : this.servceName,
        serviceCategory : this.servceCategory 
    })
      .success(function(data){       
          _this.servId = data[0].serviceId ; 
      })
      .error(function(){
        _this.toastr.error("sorry! Something Went Wrong");
      });
      this.serviceProDetail();   
   }

   serviceProDetail(){
    var _this = this;
    this.$http.post('api/serviceproviderdetails/names',{
        serviceId : _this.servId
    })
      .success(function(data){  
        for(var i=0;i<data.length;i++){
          _this.servProvNames.push(data[i]);
        }
        
          // for(var i=0;i<data.length;i++){
          //     for(var j=0;j<data[i].community.length;j++){
          //         for(var k=0;k<data[i].community[j].servicesNames.length;k++){ 
          //            if(data[i].community[j].servicesNames[k] == _this.servId[i] ){ 
          //                 _this.servProvNames.push(data[i]); 
          //            }
          //         }
                  
          //     }
              
          // }

      }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });

   }


   servNames(){
          var _this = this;
          this.serviceNames = [];
          this.$http.get('api/services')
          .success(function(data){
            _this.serviceNames = data;
          })
          .error(function(){
            _this.toastr.error("sorry! Something Went Wrong");
          })
        }


      addService(){
        var _this = this;       
        this.$http.post('/api/services/add',{
          serviceName : this.serviceName,
          serviceCategory : this.serviceCategory,
          serviceDesc : this.serviceDesc
        })
        .success(function(data){
          _this.serviceNames.push(data);

          _this.serviceName = null;
          _this.serviceCategory =null; 
        })
        .error(function(data){ 
          _this.toastr.error("sorry! Something Went Wrong");
        })
      }


   serDetails() {   //display the service providers (pending)
    this.totalServiceProvDetail = [];
   	var _this = this;
   	this.$http.get('/api/servProvRegists/getserProDetails')
   	.success(function(data)
   	{
      // for(var i=0;i<data.length;i++) {
        //    console.log(data);
        //     _this.result = data[i].totalServiceProvDetails[0];
        // _this.totalServiceProvDetail.push(_this.result); 
   _this.totalServiceProvDetail = data;

      // }
      console.log( _this.totalServiceProvDetail)
   	}).error(function(data)
   	{
     _this.toastr.error("sorry! Something Went Wrong");
   	})
    this.servNames();
   }

  // servTypeApproval(){   //service type approvals(pending)
  //   var _this = this;
  //   this.serTypeApprovals = [];
  //   this.$http.get('/api/servProvRegists/getsertypeApprovals')
  //   .success(function(data)
  //   {
  //       for(var i=0;i<data.length;i++){
  //          _this.result = data[i]._id;
  //         _this.serTypeApprovals.push(_this.result);
  //       }
       
  //   })
  //   .error(function(data)
  //   {
  //    _this.toastr.error("sorry! Something Went Wrong");
  //   })
  // }
 
  // serviceTypeApp(result) {    //approve the servicetype  
  //   var _this = this; 
  //     this.$http.post('/api/servProvRegists/serviceTypeApp',{
  //         typeId:result.serviceTypeInfo[0].typeId,
  //         serviceProviderId:result.serviceProviderInfo[0].serviceProviderId,
  //         serviceCategory:result.selectedServiceInfo[0].serviceCategory
  //     }).success(function(data)
  //     {
  //      _this.success= true;
  //       _this.declineSuccess= false;
         

  //     }).error(function(data)
  //     {
  //       _this.error=true;
  //     })
  // }

  // serviceTypeDec(result) {   //decline the service type
  //  var _this = this; 
  //     this.$http.post('/api/servProvRegists/declineServiceType',{
  //         typeId:result.serviceTypeInfo[0].typeId,
  //         serviceProviderId:result.serviceProviderInfo[0].serviceProviderId
  //     }).success(function(data)
  //     {
  //      _this.declineSuccess= true;
  //      _this.success= false;
  //     }).error(function(data)
  //     {
  //         _this.error=true;
  //     })
  // }

   serviceProApprove(user) {   //serviceprovider approve
    var _this = this;
    this.$http.post('/api/servProvRegists/approveSerProvider',{ 
      serviceProviderId:user.serviceProviderId,
      serProRegistId:user.serProRegistId
    }).success(function(data){
         _this.providersuccess  = true;
          _this.providerdeclineSuccess = false;
           for(var i=0;i<_this.totalServiceProvDetail.length;i++){
            if(_this.totalServiceProvDetail[i].serProRegistId == user.serProRegistId){
                _this.totalServiceProvDetail.splice(i,1)
            }
          }
    }).error(function(data){ 
      _this.providererror = true;
    })
   }

   serviceProDecline(user) {   //serviceprovider decline
    	var _this = this;
    this.$http.post('/api/servProvRegists/declineSerProvider',{
   		serviceProviderId:user.serviceProviderId
   	}).success(function(data){
   		_this.providerdeclineSuccess = true;
        _this.providersuccess  = false;
   	}).error(function(data){
        _this.providererror = true;
   	})
   }

}
angular.module('guwhaApp')
  .component('services', {
    templateUrl: 'app/dashboard/services/services.html',
    controller: ServicesComponent
  });

})();
