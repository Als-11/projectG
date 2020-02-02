'use strict';

(function() {

    class AdminController {
        constructor($http, $scope, $location, CommunityService,toastr) {
            this.$http = $http;
            this.CommunityService = CommunityService;
            this.awesomeThings = [];
            this.$location = $location;
            this.toastr= toastr;
            // this.sussessMessage=false;
            // this.failureMessage=false;
        }


        validEmail() {
            var _this = this;
            this.isEmailExist = true;
            this.$http.post('/api/users/getemails', { 
                emailId: this.email
            }).success(function(data) {
                if (data > 0) {
                _this.emailExist = 'Email Id is Already In Use';
                _this.isEmailExist = false;
                }
            }).error(function() {
                _this.emailExist = '';
            });
        }

        getLatLong() {
            var _this = this;
            _this.reqAddress = this.address1+'+'+this.locality+'+'+this.city;
             var url = "http://maps.google.com/maps/api/geocode/json?address="+ _this.reqAddress;
              _this.$http.post(url, _this.credentials, {withCredentials : false})
               .success(function(response)
               {
                   _this.latLongValue = response.results[0].geometry.location;
                })
        }


        registerCommunity(form) {
            var _this = this;
            var regSussessfull =''; 
            var regFailure = '';
            if((this.firstName === null || undefined) || (this.lastName === null || undefined) ||
                 (this.email=== null || undefined) || (this.phoneNumber === null || undefined) ||  
                 (this.communityName === null || undefined) || (this.address1 === null || undefined) || 
                 (this.locality === null || undefined) || (this.city === null || undefined) ||
                 (this.gender === null || undefined) ){ 

                    this.errorMessage = 'Please fill the Provided Fields';
                return;

            }

            else if((this.checked === false)){
                this.errorMessage = 'Please accept terms and conditions';
                return;
            }


            else {
                 if(this.gender=="MALE"){
                    var imageUrl= 'http://steezo.com/wp-content/uploads/2012/12/man-in-suit2.jpg';
                }
                else{
                    var imageUrl= 'https://www.colourbox.com/preview/2324264-successful-business-woman-in-black-suit-over-white.jpg'
                }
                this.$http.post('/api/community', {  //community
                firstName: this.firstName,
                lastName: this.lastName,
                emailId: this.email,
                phoneNumber: this.phoneNumber,
                communityName: this.communityName,
                 maintenanceCost:0,
                maintenanceDate :0,
                gender: this.gender,
                imageUrl:imageUrl,
                address:{
                        address1: this.address1,
                        locality: this.locality,
                        city: this.city
                },
                longValue:this.latLongValue.lng,
                latValue:this.latLongValue.lat
                }).success(function() {
                    //_this.regSussessfull = 'Registration Successfull! Password has sent registered email :-)';
                    //_this.sussessMessage=true;
                    _this.firstName=null,
                    _this.lastName=null,
                    _this.email=null,
                    _this.phoneNumber=null,
                    _this.communityName=null,
                    _this.address1=null,
                    _this.locality=null,
                    _this.city=null,
                    _this.gender=null,
                    _this.errorMessage='';
                    _this.regFailure='';
                    _this.toastr.success('Password Has Sent To Registered Email!', 'Registration Successfull :-)');
                    form.$setValidity(); 
                    form.$setUntouched();
                    //_this.failureMessage=false;
                }).error(function() {
                    //_this.regFailure = 'Sorry! Registration unsussessfull :-(';
                    //_this.failureMessage=true;
                    //_this.sussessMessage=false;
                    _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
                });
            }
        }


    }

    angular.module('guwhaApp')
        .controller('AdminController', AdminController);
})();