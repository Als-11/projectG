'use strict';

(function() {

class MainController {

  constructor($http, $scope,Auth,$location,CommunityService,$rootScope) {
    this.$http = $http;
    // this.socket = socket;
    this.CommunityService = CommunityService;
    this.awesomeThings = [];
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.totalResult = [];
    this.Auth = Auth;
    this.communityId = this.Auth.getCurrentUser().communityId; 
    $scope.$on('$destroy', function() {

    });
    // this.socket.syncUpdates('notifications',this.awesomeThings,function(){
    //   console.log('Some Update happened');
    // });
  }
 
  suggestion() // suggest the registered Community names in the search box
 {
    var _this = this; 

      this.$http.post('/api/community/suggestions', {keyword:this.search.result}) //contains user selected community name
          .success(function(data)
          { 
            _this.totalResult = data;
            _this.search.options= [];
            _this.result = [];
            var i=0;
            for( ;i < data.length ; i++)
            {
             _this.search.options.push(data[i].communityName+ ',' +data[i].address.address1+','+data[i].address.locality);
               //pushes the communityName, address1 and Locality to the user in search box
               
            }
        });
  }   
        


  selectedBlocks() {     //seeting the user selected community in communityservice
        this.CommunityService.selectedCommunityFromMainpage(this.search.result);
      }


   joinCommunity() {     //tranfer the page to signup.html
        this.$location.path('/signup');
      }
  

}

angular.module('guwhaApp')
  .component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController
  });

})();
