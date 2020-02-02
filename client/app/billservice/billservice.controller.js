'use strict';
(function(){

class BillserviceComponent {
  constructor($http, Auth) {
    this.message = 'Hello';
    this.$http = $http;
    this.Auth = Auth;
    this.getCurrentUser = Auth.getCurrentUser;
    this.providers = [];
  }

  $onInit() {
    this.$http.get('/api/billservices').then(response => {
        this.providers = response.data; 
    //  this.socket.syncUpdates('thing', this.awesomeThings);
    });
  }
  addService() {
    if(this.eProviderId) { 
        this.$http.post('/api/billservices', { eProviderId: this.eProviderId, eUniqueId: this.eUniqueId, userId: this.getCurrentUser().userId });
        this.newThing = '';
    }
  }
}

angular.module('guwhaApp')
  .component('billservice', {
    templateUrl: 'app/billservice/billservice.html',
    controller: BillserviceComponent,
    authenticate: true
  });

})();


