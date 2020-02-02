'use strict';

(function() {

    class ServiceprovidersignupController {
        constructor($http,$location,toastr) {
            this.$http = $http;
            //this.serviceproviderform=false;
            this.serviceproviderMessage;
            this.toastr= toastr;

        }

        suggestion() // suggest the registered Community names in the search box
            {

                var _this = this;
                this.$http.post('/api/community/suggestions', { keyword: this.AppartmentName }) //contains user selected community name
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

            selectedCommunity(){
                var _this = this;
                var communityName = this.AppartmentName.split(',');
                this.$http.post('/api/community/getCommunityBlocks', {
                    communityName: communityName[0],
                    address1: communityName[1],
                    locality: communityName[2]
                }) //we will get the blocknames based on the communityname,address,locality//
                .success(function(data) {
                    window.communityId = data.communityId;
                });
            }


        onRegister(form){
            var _this=this;
            if( (this.firstName == null || undefined) || (this.lastName == null || undefined) ||
                  (this.emailId== null || undefined) ||  (this.gender == null || undefined) ||
                  (this.phoneNumber == null || undefined) ||  (this.companyAddress == null || undefined) ||
                  (this.companyname == null || undefined) || (this.companyInfo == null || undefined) ){ 
                
                 this.errorMessage = 'Please fill the Provided Fields';
                 return;
            }
            else{
                 if(this.gender=="MALE"){
                    var imageUrl= 'http://steezo.com/wp-content/uploads/2012/12/man-in-suit2.jpg';
                }
                else{
                    var imageUrl= 'https://www.colourbox.com/preview/2324264-successful-business-woman-in-black-suit-over-white.jpg';
                }
                this.$http.post('/api/serviceProviderDetails/create',{
                firstName:this.firstName,
                lastName:this.lastName,
                companyName:this.companyname,
                emailId:this.emailId,
                landlineNumber:this.landlineNo,
                phoneNumber:this.phoneNumber,
                gender:this.gender,
                address:this.companyAddress,
                imageUrl:imageUrl,
                companyInfo:this.companyInfo
            }).success(function(data){
                _this.anothermethod();
                _this.firstName=null,
                _this.lastName=null,
                _this.companyname=null,
                _this.emailId=null,
                _this.landlineNo=null,
                _this.phoneNumber=null,
                _this.companyAddress=null,
                _this.companyInfo=null,
                _this.AppartmentName=null,
                _this.errorMessage = '';  
                _this.toastr.success('You Will Get Password To Your Registered EmailId For Login!', 'Success');
                form.$setValidity(); 
                form.$setUntouched();
                //_this.serviceproviderMessage="You will get password to your registered emailId for login";
            }).error(function(data){
                // _this.serviceprovidererform=true;
                console.log(data);
                _this.errorMessage = '';
                _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
                // _this.serviceproviderMessage="your registration is not successful";
            })
            }
        }

        anothermethod(){
            alert(this.emailId);
            this.$http.post('/api/serviceProviderDetails/anothermethod',{
                    email:this.emailId
                }).success(function(data)
                {
                    console.log(data);
                })
        }
    }

    angular.module('guwhaApp')
        .controller('ServiceprovidersignupController', ServiceprovidersignupController);

})();
