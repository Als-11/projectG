'use strict';

var communityService = angular.module('guwhaApp.communityService', []);
communityService.factory('CommunityService', function( $http) {
   //var communityId = Auth.getCurrentUser().communityId;
   var factory = {};
   var selectedvalue;
   
   factory.multiply = function(a, b) {
      return a * b;
   };

   factory.getAmenties = function() {
   	//var deferred = $q.defer();
   var promise = $http.get('/api/amenities');
   	promise.then(function(response) {
       //deferred.resolve(response);
        return response.data;     
   });
    return promise;  
   };

 factory.getBlocks = function() {
  var promise =$http.get( '/api/community/blocks/');
   promise.then(function(response)
        {
          return response.data;
        });
        return promise;
     };

factory.selectedCommunityFromMainpage= function(a) {
      selectedvalue  = a;   //selcted appartment value is given in to selectedvalue(made global)
   return selectedvalue;
}
factory.selectdCategory = function(){  //return selected appartment value to signup.html
  return selectedvalue;
}

factory.getEmployeeType = function() {
  var promise =$http.get( '/api/employees/getEmployeeTyped');
   promise.then(function(response)
        {
          return response.data;
        });
        return promise;
     };






   
   return factory;
}); 

