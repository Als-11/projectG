'use strict';
var app = angular.module('guwhaApp')
app.filter('guwhafilter', function(){
 return function(value){
     var valueInt = parseInt(value);
      if(valueInt == 0 || valueInt < 10){
         return "0"+ valueInt;
      }
      else{
      	return valueInt;
      }  
   }
 });






    

