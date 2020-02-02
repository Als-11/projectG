'use strict';
(function () {

    class ProfileComponent {
        constructor($http, Auth, $location, CommunityService, NgTableParams, toastr) {
            this.$http = $http;
            this.$location = $location;
            this.Auth = Auth;
            this.toastr = toastr;
            this.NgTableParams = NgTableParams;
            this.rowUserBillsList = [];
            this.loggedInRole = this.Auth.getCurrentUser().role;
            this.UserBillsTable = new NgTableParams({
                page: 1,
                count: 4
            }, {
                dataset: []
            });
            this.User = this.Auth.getCurrentUser();
            this.communityId = this.Auth.getCurrentUser().communityId;
            this.CommunityService = CommunityService;
            this.operators = [];
            this.searchresults = [];
            this.previousNumber = '';
            this.immage = false;
            this.previousSecurityLevel = '';
            this.showPasswordForm = false;
            this.visible = false;
            this.profileMethods();
            this.getLatLong();
            this.formdata = new FormData();
            this.imageUrl = '';
            // this.getrole();

        }

        profileMethods() {
            this.getCommunity();
            this.billservice();
            this.getbillservices();
            if(this.loggedInRole=="SERVICE_PROVIDER"){
                this.serviceProviderProfile();
            }
            else{
                this.profile();
            }
        }

        getLatLong() {
            var _this = this;
            this.$http.get('/api/community/getLatLong')
                .success(function (data) {
                    _this.latValue = data.latValue;
                    _this.longValue = data.longValue;
                })
                .error(function () {
                    _this.toastr.error("sorry! Something Went Wrong");
                })
        }



        saveLocation() {
            var _this = this;
            this.value = document.getElementById('current').innerHTML.split(':');
            this.$http.post('/api/community/changeLatLong', {
                    latValue: this.value[1],
                    longValue: this.value[3]
                }).success(function (data) {
                    _this.toastr.success("Location Changed Successfully");
                })
                .error(function () {
                    _this.toastr.error("sorry! Something Went Wrong");
                })

        }

        getCommunity() {
            var _this = this;
            this.CommunityService.getBlocks()
                .success(function (data) {
                    _this.security = data.securityLevel;
                    _this.communityNames = data.communityName;
                    _this.previousSecurityLevel = data.securityLevel;
                    _this.address = data.address;
                    _this.commName = data.communityName;
                }).error(function () {
                    _this.toastr.error("sorry! Something Went Wrong");
                });
        }

        passwordMatch() { //new password validation 
            if (this.newpassword === this.confirmpassword) {
                this.message = 'password matches';
                this.passwordcorrect = true;
            } else {
                this.message = 'Re-enter the password correctly ';
            }
        }


        editForm() { //show the change-password form
            this.editFormShow = false;
            this.allFormsShow = true;
        }
        closePasswordForm() {
            this.showPasswordForm = false;
            this.passwordChanged = "";
        }

        cancelEdit() {
            var _this = this;
            this.getbillservices();

        }

        changePassword() {
            var _this = this;
            if (this.newpassword === this.confirmpassword) {
                this.Auth.changePassword(this.oldpassword, this.newpassword, function (data) {
                    if (data === null) {
                        _this.showPass = false;
                        _this.showChange = true;

                        //_this.passwordChanged = 'Password Changed Successfully';
                        _this.toastr.success('Password Changed Successfully!', 'Success');
                        _this.showPasswordForm = false;
                    } else {
                        _this.showPass = true;
                        _this.showChange = false;
                        //_this.passwordChanged = 'Old Password is wrong';
                        _this.toastr.error('Old Password Is Wrong!', 'Failed');

                        _this.showPasswordForm = true;
                    }
                    _this.oldpassword = _this.newpassword = _this.confirmpassword = '';
                });


            } else {
                //this.passwordChanged = 'Mismatch Confirm password';
                _this.toastr.warning('Miss Match Password!', 'Warning');
                _this.newpassword = _this.confirmpassword = '';
            }



        }


        fetchBill() {
            this.$http.get('http://api.billpaymart.com/ws/viewBill?apiToken=bba6df4928c142f2b31a050babdc9890&mn=6064018000&op=125')
                .success(function () {})
                .error(function () {
                    _this.toastr.error("sorry! Something Went Wrong");
                });
        }


        profile() {
            var _this = this;
            this.Passwordmatches = false;
            this.securityLevels = ['STRICT', 'MODERATE', 'EASY'];
            //var communityId = '';
            this.$http.post('/api/users/profile')
                .success(function (data) {
                    _this.imageUrl = data.imageUrl + '?_ts=' + new Date().getTime();
                    _this.communityid = data.communityId;
                    _this.email = data.email;
                    _this.role = data.role;
                    _this.name = data.firstName;
                    _this.phoneNumber = data.phoneNumber;
                    _this.flatNumber = data.houseNumber;
                    _this.commName = data.communityName;
                    if (data.role === 'EMPLOYEE') {
                        if (data.employeeType === 'SECURITY') {
                            _this.employeeType = data.employeeType;
                        }
                    }
                    _this.previousNumber = data.phoneNumber; //previous Phone Numbeer 
                }).error(function () {
                    _this.toastr.error("sorry! Something Went Wrong");
                });
        }


        serviceProviderProfile() { //service provider profile 
            var _this = this;
            this.Passwordmatches = false;
            this.$http.get('/api/serviceProviderDetails/serviceProviderProfile')
                .success(function (data) {
                	console.log(data);
                	_this.imageUrl = data[0].userinfo[0].imageUrl + '?_ts=' + new Date().getTime();
                    _this.email = data[0].emailId;
                    _this.role = "SERVICE_PROVIDER"
                    _this.name = data[0].firstName;
                    _this.phoneNumber = data[0].mobileNumber;
                    _this.companyName = data[0].companyName;
                    _this.address = data[0].address;
                }).error(function () {
                    _this.toastr.error("sorry! Something Went Wrong");
                });
        }


        editName() {
            this.isEditing = false;
            this.visible = true;
        }

        getTheFiles($files) {
            console.log($files);
            this.formdata = new FormData();
            var _this = this;
            angular.forEach($files, function (value, key) {
                _this.formdata.append(key, value);
            });
            _this.readUrl($files);
        };
        uploadFiles() {
            var _this = this;
            var request = {
                method: 'POST',
                url: 'api/users/changeImage',
                data: _this.formdata,
                headers: {

                    'Content-Type': undefined
                }
            };

            // SEND THE FILES.

            this.$http(request)
                .success(function (data) {
                    _this.imageUrl = data.imageUrl + '?_ts=' + new Date().getTime();
                    console.log(_this.imageUrl);
                })
                .error(function () {});
        };

        readUrl(files) {
            var _this = this;
            console.log(files[0]);
            if (files) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#profilePic')
                        .attr('src', e.target.result)
                        .width(250)
                        .height(200);
                };
                reader.readAsDataURL(files[0]);
            }

        }

        selectedImage() {
            var _this = this;
            _this.immage = true;
        }

        changeProfile() {
            var _this = this;
            if ((this.phoneNumber == null || undefined) || (this.phoneNumber.length < 9)) {
                this.toastr.warning('Please Enter Valid Phone Number!', 'Warning');
                return;
            } else {
                this.$http.post('/api/users/changeprofile', {
                    phoneNumber: this.phoneNumber
                }).success(function (data) {
                    if (data.phoneNumber == _this.previousNumber || data.securityLevel == _this.previousSecurityLevel) {
                        _this.toastr.info('Please provide changes!', 'Warning');
                    } else {
                        _this.toastr.success('Changes Saved Successfully!', 'Success');
                    }
                    if ((_this.securityLevel === null) || (_this.securityLevel === undefined)) {
                        return;
                    } else {
                        _this.setSecurityLevel();
                    }
                }).error(function (data) {
                    _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
                });

            }
            this.isEditing = true;
        }



        servprovchangeProfile() { //update profile of service provider
            var _this = this;
            if ((this.serprovphoneNumber == null || undefined) || (this.serprovphoneNumber.length < 9)) {
                this.toastr.warning('Please Enter Valid Phone Number!', 'Warning');
                return;
            } else {
                this.$http.post('/api/users/changeprofile', {
                    mobileNumber: this.serprovphoneNumber
                }).success(function (data) {
                    if (data.mobileNumber == _this.serprovphoneNumber) {
                        _this.toastr.info('Please provide changes!', 'Warning');
                    } else {
                        _this.toastr.success('Changes Saved Successfully!', 'Success');
                    }

                }).error(function (data) {
                    _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
                });

            }
            this.isEditing = true;
        }


        setSecurityLevel() {
            var _this = this;
            var securityLevel = this.securityLevel;
            if ((this.securityLevel === null) || (this.securityLevel === undefined)) {
                this.toastr.warning('No Security Level Is Selected!', 'Warning');
                return;
            } else {
                this.$http.post('/api/community/setSecurityLevel', {
                        securityLevel: securityLevel
                    })
                    .success(function (data) {
                        _this.toastr.success('Selected Security Level Is Set!', 'Success');
                        _this.getCommunity();
                    }).error(function (data) {
                        _this.toastr.error('Something Went Wrong!', 'Failure');
                    });
                this.visible = false;
            }

        }

        refreshTable(tableName, data) {
            switch (tableName) {
            case 'UserBillsTable':
                this.UserBillsTable = new this.NgTableParams({
                    page: 1,
                    count: 4
                }, {
                    dataset: data,
                    counts: []
                });
            }
        }

        // here we get user billservices
        getbillservices() {
            var _this = this;
            this.$http.post('/api/userbillservices/getbills')
                .success(function (data) {
                    _this.userBillsList = [];
                    _this.userBillsList = data;
                    _this.refreshTable('UserBillsTable', _this.userBillsList);
                }).error(function () {});
        }

        billservice() {
            var _this = this;
            this.$http.get('/api/billservices/getservice')
                .success(function (data) {
                    _this.billserviceResult = data;
                });
        }

        userSelectedCategory() {
            var _this = this;
            _this.operators = [];
            _this.userselectedData = [];
            this.$http.post('/api/billservices/userSelectedCategory', {
                category: this.billserviceCategory
            }).success(function (data) {
                _this.userselectedData = data;
                for (var i = 0; i < _this.userselectedData.length; i++) {
                    _this.operators.push(_this.userselectedData[i].provider);
                }
            });
        }


        searchOperator() {
            var _this = this;
            this.searchresults = [];
            for (var i = 0; i < this.operators.length; i++) {
                var result = _this.operators[i].toLowerCase().startsWith(this.search.toLowerCase());
                if (result === true) {
                    this.searchresults.push(this.operators[i]);
                }
            }
        }

        selectedOperator() { //based on the user selected operator retriew the respective data
            var _this = this;
            this.$http.post('/api/billservices/userSelectedoperator', {
                operator: this.search,
                category: this.billserviceCategory
            }).success(function (data) {
                _this.OperatorDetails = data;
            });
        }

        saveBillservice() { //saved the user billservice 
            var _this = this;
            var row = {};
            row.operator = this.search;
            row.uniqueId = this.uniqueNumber;
            row.Category = this.billserviceCategory;
            row.billServiceId = this.OperatorDetails.billServiceId;
            this.$http.post('/api/userbillservices/saveBillservice', {
                billServiceId: this.OperatorDetails.billServiceId,
                uniqueId: this.uniqueNumber,
                operator: this.search,
                category: this.billserviceCategory
            }).success(function () {
                _this.showBill = true;
                _this.saved = 'Service has been Saved';
                _this.userBillsList.push(row);
                _this.refreshTable('UserBillsTable', _this.userBillsList);
                _this.billserviceCategory = null;
                _this.uniqueNumber = null;
                _this.search = null;

                _this.toastr.success('Bill Service Added!', 'Success');
            }).error(function (data) {
                _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
            });
        }

        updateUserBillDetails(row) {
            var _this = this;
            var operator = row.operator;
            var uniqueId = row.uniqueId;
            var category = row.Category;
            var billServiceId = row.billServiceId;
            this.$http.post('/api/userbillservices/updateUserBillDetails', {
                operator: operator,
                uniqueId: uniqueId,
                category: category,
                billServiceId: billServiceId
            }).success(function (data) {
                _this.rowUserBillsList = data;
                _this.refreshTable('UserBillsTable', _this.rowUserBillsList);
                _this.toastr.info('Details Updated!', 'Success');
            }).error(function (data) {
                _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
            });

        }

    }

    angular.module('guwhaApp')
        .component('profile', {
            templateUrl: 'app/profile/profile.html',
            controller: ProfileComponent
        });

})();