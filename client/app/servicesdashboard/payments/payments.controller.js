'use strict';
(function() {

    class paymentsComponent {
        constructor(Auth, $location, $http, toastr) {
            this.$http = $http;
            this.$location = $location;
            this.Auth = Auth;
            this.toastr = toastr;
            this.User = this.Auth.getCurrentUser();
            this.firstName = this.Auth.getCurrentUser().firstName;
            this.communityId = this.Auth.getCurrentUser().communityId;
            this.getCommunities();
            this.getPayments();
            // this.limit = new Date.toString();
            this.payDetailsFrTble();


        }

        getCommunities() { //getting the Service provider related communities(payments raise form)
            var _this = this;
            var a = new Date().getDate();
            // var limiit = new Date().setDate(a-1);
            // this.limit = new Date(limiit).toString();
            _this.communityList = [];
            this.$http.get('api/serviceProviderDetails/getcommunities')
                .success(function(data) {
                    console.log(data);
                    for (var i = 0; i < data.length; i++) {
                        _this.communityList.push(data[i].TotalCommunityInfo[0].communityName + ',' + data[i].TotalCommunityInfo[0].address.address1 + ',' +
                            data[i].TotalCommunityInfo[0].address.locality);
                    }

                }).error(function() {
                    _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
                });
        }

        getServices() { //getting services related to type community
            var _this = this;
            _this.servicesNames = [];
            this.selectedCommunity = this.searchedCommunity.split(',');
            this.$http.post('/api/serviceProviderDetails/getServicesNames', {
                    communityName: this.selectedCommunity[0],
                    address1: this.selectedCommunity[1],
                    locality: this.selectedCommunity[2]
                })
                .success(function(data) {

                    console.log(data);
                    for (var i = 0; i < data.length; i++) {
                        _this.servicesNames.push(data[i].brands.serviceCategory);
                    }
                }).error(function(data) {
                    _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
                })
        }


        selectedSerCategory() { //getting the service types based on the category(provider view)
            var _this = this;
            _this.serviceTypArray = [];
            this.$http.post('/api/serviceProviderDetails/getserviceTypes', {
                serviceCategory: this.selectedService
            }).success(function(data) {
                console.log(data);
                for (var i = 0; i < data.length; i++) {
                    var brandName = data[i]._id.ToTalBrands[0].brandName;
                    var quantity = data[i]._id.ToTalBrands[0].quantity;
                    var service = brandName + ',' + quantity;
                    _this.serviceTypArray.push(service)
                }
            }).error(function(data) {
                _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
            })

        }

        // getUsers() {   //getting the users based on the servicetypeId,community,serviceprovider
        //   var _this = this;
        //   this.$http.post('/api/serviceRequests/getUsersInfo',{
        //      serviceCategory:this.selectedService,
        //     communityName:this.searchedCommunity,
        //     typeName:this.serviceTypes
        //   }).success(function(data)
        //   { 
        //   }).error(function(data)
        //   { 
        //   })
        // }


        customersSuggestion() { //getting community customers
            var _this = this;
            this.$http.post('/api/users/customers', {
                    keyword: this.selectedCustomerName,
                    communityName: this.selectedCommunity[0],
                    address1: this.selectedCommunity[1],
                    locality: this.selectedCommunity[2]
                })
                .success(function(data) {
                    _this.searchoptions = [];
                    var i = 0;
                    for (; i < data.length; i++) {
                        _this.searchoptions.push(data[i].firstName + ',' + data[i].houseNumber);
                        //pushes the user, address1 and flatnumber to the user in search box
                    }
                })
                .error(function() {
                    _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
                });
        }


        selectedUserName() { //here we get the particular usedId of the user(here customer) selected by service Provider(user info selected)
            this.availablePaymentType = ['UTILITY_BILLS', 'MAINTENANCE', 'GROCERIES', 'MILK_SERVICE', 'WATER_SERVICE'];
            var _this = this;
            this.userName = this.selectedCustomerName.split(',');
            this.$http.post('/api/users/getUserId', {
                firstName: this.userName[0],
                houseNumber: this.userName[1],
                communityName: this.selectedCommunity[0]
            }).success(function(data) {
                _this.userEmail = data[0].email;
                _this.userPhoneNumber = data[0].phoneNumber;
                _this.userId = data[0].userId;
            }).error(function() {
                _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
            });
        }


        savePaymentRequest() { //payments raise
            var _this = this;
            this.userName = this.selectedCustomerName.split(',');
            this.selectedCustomerId = this.userId;
            this.$http.post('/api/paymentsrequests/createpayrequest', {
                communityName: this.selectedCommunity[0],
                address1: this.selectedCommunity[1],
                locality: this.selectedCommunity[2],
                firstName: this.userName[0], //user name
                amount: this.amount,
                paymentType: this.paymentType,
                paymentDate: this.paymentDate,
                customerId: this.selectedCustomerId,
                raisedBy: this.selectedService
            }).success(function(data) {
                _this.toastr.success('Payments Raised!', 'Success');
                _this.getPayments(); //update the amount in cards 
            }).error(function(data) {
                _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
            })
        }


        getPayments() { //get payments (communityname card show)
            var _this = this;
            _this.getPaymentsArray = [];
            this.$http.get('/api/paymentsrequests/getPayments')
                .success(function(data) {
                    _this.getPaymentsArray = data;
                }).error(function(data) {
                    _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
                })
        }

        payDetailsFrTble() { //by default all payments shown(all communities)
            var _this = this;
            this.showResPayments = false;
            this.showPaymentsTable = true;
            this.payDetailsFrTbleArray = [];
            this.$http.get('/api/paymentsrequests/payDetailsFrTble')
                .success(function(data) {
                    _this.payDetailsFrTbleArray = data;
                }).error(function() {
                    _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
                })
        }

        getPaymenDetails(payment) { //respective payments in the table
            var _this = this;
            this.respayDetails = [];
            this.showResPayments = true;
            this.showPaymentsTable = false;
            this.$http.post('/api/paymentsrequests/getPaymenDetail', {
                communityName: payment._id.communityInfo[0].communityName,
                communityId: payment._id.communityInfo[0].communityId
            }).success(function(data) {
                _this.respayDetails = data;
            }).error(function() {
                _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
            })

        }









    }

    angular.module('guwhaApp')
        .component('payments', {
            templateUrl: 'app/servicesdashboard/payments/payments.html',
            controller: paymentsComponent
        });

})();
