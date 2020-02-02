'use strict';

(function() {

    class SignupController {

        constructor($http, $scope, socket, Auth, $location, CommunityService, toastr) {
            this.$http = $http;
            this.socket = socket;
            this.CommunityService = CommunityService;
            this.toastr = toastr;
            this.awesomeThings = [];
            this.$location = $location;
            this.totalResult = [];
            this.Auth = Auth;
            this.show = false;
            // this.selected = { value: this.itemArray[0] };
            this.communityId = this.Auth.getCurrentUser().communityId;
            this.selectedAppartmentNameFromMainpage(); //getting the selected appartment value

        }

        selectedAppartmentNameFromMainpage() {
            var _this = this;
            _this.user = {};
            this.searchresult = this.CommunityService.selectdCategory();
            if (_this.searchresult !== undefined) {
                _this.user.AppartmentName = this.searchresult;
                this.selectedBlocks();
            }

        }


        $onInit() {}

        validEmail() {
            this.emailExists = '';
            var _this = this;
            this.$http.post('/api/approvals/getemails', {
                emailId: this.user.emailId
            }).success(function(data) {
                _this.emailExists = "Somebody has been using this emailid";
            }).error(function(data) {
                _this.$http.post('/api/users/getemails', {
                    emailId: _this.user.emailId
                }).success(function(data) {
                    if (data > 0) {
                        _this.emailExists = "Somebody has been using this emailid";
                    }
                }).error(function(data) {
                    _this.emailExists = '';

                })
            });
        }

        cleanWarning() {
            this.emailExists = '';
        }

        userSelectedFlatNumber() { //feteching the user selected flatNumber in the flatNumberArray
            window.flatNumbers = this.flatNumbers;

        }

        suggestion() // suggest the registered Community names in the search box
            {

                var _this = this;
                this.$http.post('/api/community/suggestions', { keyword: this.user.AppartmentName }) //contains user selected community name
                    .success(function(data) {
                        _this.totalResult = data;
                        _this.searchoptions = [];
                        _this.result = [];

                        var i = 0;
                        for (; i < data.length; i++) {
                            _this.searchoptions.push(data[i].communityName + ',' + data[i].address.address1 + ',' + data[i].address.locality);
                            //pushes the communityName, address1 and Locality to the user in search box
                        }
                    });



            }
        geetingBlocksInfo() {
            var _this = this;
            this.CommunityService.getBlocks() //the getBlocks method in communityService returns a promise 
                .success(function(data) {
                    _this.blocksList = data.blocks;

                });
        }

        onRegister(form) {
            var _this = this;
            var communityName = this.user.AppartmentName.split(','); //split the communityName from the location
            var blockName = this.user.flatNumber.split('-');
            if (this.user.gender == "MALE") {
                var imageUrl = 'http://steezo.com/wp-content/uploads/2012/12/man-in-suit2.jpg';
            } else {
                var imageUrl = 'https://www.colourbox.com/preview/2324264-successful-business-woman-in-black-suit-over-white.jpg';
            }
            this.$http.post('/api/approvals/', {
                firstName: this.user.firstName,
                lastName: this.user.lastName,
                communityName: communityName[0],
                blockName: blockName[0],
                emailId: this.user.emailId,
                houseNumber: this.user.flatNumber,
                phoneNumber: this.user.phoneNumber,
                imageUrl: imageUrl,
                gender: this.user.gender,
                // floorNumber: this.floors.floorNumber,
                flatNumber: blockName[1], // using window keyword we make the user selected flatnumber available in whole controller. 
                communityId: window.communityId //making communityid available to the whole controller
            }).success(function() {
                _this.user = {};
                _this.toastr.success('Password will be sent to your registered email :-)', 'Registration Request Successfull');
                form.$setValidity();
                form.$setUntouched();

            }).error(function(data) {
                _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
            });
        }


        selectedBlocks() {
            var _this = this;
            var communityName = this.user.AppartmentName.split(',');
            this.show = true;
            //split the communityName from the location
            this.$http.post('/api/community/getCommunityBlocks', {
                    communityName: communityName[0],
                    address1: communityName[1],
                    locality: communityName[2]
                }) //we will get the blocknames based on the communityname,address,locality//
                .success(function(data) {
                    window.communityId = data.communityId;
                    _this.result = data.blocks;
                }).error(function(data) {

                });
        }


        flatNumbers() { //flatNumber Search

            this.resultFlatNumberArray = [];
                var _this = this;
                console.log(this.user.flatNumber);
                console.log(window.communityId)
                this.$http.post('/api/floors/suggestions', 
                { keyword: this.user.flatNumber,
                communityId:window.communityId
                }) //contains user selected community name
                    .success(function(data) {
                        _this.totalResult = data;
                        _this.searchoptions = [];
                        _this.result = [];

                        var i = 0;
                        for (; i < data.length; i++) {
                            _this.resultFlatNumberArray.push(data[i].blockName + '-' + data[i].flatNumber);
                            //pushes the communityName, address1 and Locality to the user in search box
                        }
                    });






            }

    }

    angular.module('guwhaApp')
        .controller('SignupController', SignupController);

})();
