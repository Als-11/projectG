'use strict';
(function() {

    class DeclineCommunitiesComponent {
        constructor(Auth, $location, $http) {
            this.$http = $http;
            this.$location = $location;
            this.declinedCommunities();
        }


        declinedCommunities() {
            var _this = this;
             _this.comunitynames = [];
            this.$http.get('api/servProvRegists/decCommName')
            .success(function(data)
            {
                _this.comunitynames = data;
                if(data.length == 0){
                     _this.communityNames ="Sorry,No Communities"
                } 
            }).error(function(data)
            {
                 _this.communityNames ="Sorry,No Communities"
            })
        }

    }

    angular.module('guwhaApp')
        .component('declinecommunities', {
            templateUrl: 'app/servicesdashboard/declinecommunities/declinecommunities.html',
            controller: DeclineCommunitiesComponent
        });

})();
