'use strict';

(function() {


    class SettingsComponent {
        constructor(Auth, $location, $http, CommunityService, toastr) {
            this.page = 'billpayments';
            this.$http = $http;
            this.data = [];
            this.bkngFrom = ["Am", "Pm"];
            this.userSelectedBlock = [];
            this.Auth = Auth;
            this.loggedInRole = this.Auth.getCurrentUser().role;
            // this.tableParams = '';
            this.flatNumbersArray = [];
            this.showFirstTable=true;
             this.searchtable=false;
            this.message = 'Hello';
            this.toastr = toastr;
            this.$location = $location;
            this.CommunityService = CommunityService; //here we import communitservice to maincontroller from components/communitservice.js
            // this.NgTableParams = NgTableParams;
            this.floorNumberArray = [];
            this.showResidents = false;
            // this.floorTable = new NgTableParams({
            //     page: 1,
            //     count: 5
            // }, {
            //     dataset: []
            // });
            // this.amenityTable = new NgTableParams({
            //     page: 1,
            //     count: 5
            // }, {
            //     dataset: []
            // });

            // this.blockTable = new NgTableParams({
            //     page: 1,
            //     count: 5
            // }, {
            //     dataset: []
            // });
            this.Auth = Auth;
            this.blocksList = [];
            this.amenitylist = [];
            this.searchresults = [];
            this.datset = [];
            this.blockNames = [];
            this.floorss = false;
            this.User = this.Auth.getCurrentUser();
            this.firstName = this.Auth.getCurrentUser().firstName;
            this.communityId = this.Auth.getCurrentUser().communityId;
            this.settingsMethods();
            this.maintananceDetails();
        }

        settingsMethods() {

            if (this.Auth !== undefined && this.Auth.isLoggedIn() === true) {
                // Welcome sir you are logged in
                this.getBlocks();
                this.getAmenties();
                this.MaintainenceTable();
            } else {
                // Sorry trespassers not allowed
                this.$location.path('/');
            }
            var a = new Date().getDate();
            var limiit = new Date().setDate(a - 1);
            this.limit = new Date(limiit).toString();
            this.timeIntervalArray = ['hourly', '3Hours', '6hours', 'day']
            this.dates = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
        this.selcetedFaltType = ["2BHK","3BHK","4BHK","5BHK"] 
       }
        selectTimeInterval() {
            if (this.timeInterval != 'day') {
                this.showForms = true;
            } else {
                this.showForms = false;
            }
        }

        editModeActive() {
            this.editModes = true;
              console.log(this.flatNumberSearch);
        }
        cancelMode() {
            this.editModes = false;
        }

        MaintainenceTable() {
            var _this = this;
            this.maintenanceArray = [];
            this.$http.get('/api/floors/getMaintnceDetails')
                .success(function(data) {
                    _this.maintenanceArray = data;
                }).error(function(data) {
                    _this.toastr.error("Sorry! Something Went Wrong");
                })
        }




        savemaintananceDetails(entry, result) {
            var _this = this;
            if (entry.maintenanceCost == undefined || entry.maintenanceCost == null) {
                var maintenanceCost = result.maintenanceCost;
            } else {
                var maintenanceCost = entry.maintenanceCost;
            }
            this.$http.post('/api/floors/inlineEdit', {
                houseNumber: result.houseNumber,
                flatType: entry.selectedType,
                maintenanceCost: maintenanceCost,
            }).success(function(data) {
                _this.MaintainenceTable();
            })
        }


        changePage(menu) {
            this.page = menu;
        }

        maintananceDetails() { //communityAdmin expenses
            // this.options = {legend: {display: true}};
            var _this = this;
            this.monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
            this.CategoryNamesArray = [];
            this.totalCostArray = [];
            var fDate = new Date();
            _this.month = fDate.getMonth();
            this.monthName = this.monthNames[_this.month];
            this.date = 1;
            if (_this.month == 0 || _this.month == 2 || _this.month == 4 || _this.month == 6 || _this.month == 7 || _this.month == 9 || _this.month == 11) {
                this.endDate = 31;
            } else if (_this.month == 1) {
                this.year = fDate.getYear();
                if (this.year / 4 == 0) {
                    this.endDate = 29;
                } else {
                    this.endDate = 28;
                }

            } else {
                this.endDate = 30;
            }
            this.communityCategoryNamesArray = [];
            this.communitytotalCostArray = [];
            this.adminpaymentsArray = [];
            var fDate = new Date();
            this.fromDate = fDate.setDate(1);
            this.toDate = new Date();
            this.$http.get('/api/community/getLatLong')
                .success(function(data) {
                    _this.monthlyMaintanance = data.maintenanceCost;
                    _this.$http.get('/api/paymentsrequests/getadminPayments')
                        .success(function(data) {
                            for (var i = 0; i < data.length; i++) {
                                _this.adminpaymentsArray = data;
                            }
                        })


                }).error(function(data) {
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
        }

        getAmenties() { //get amenties based on the communityId
            var _this = this;
            this.CommunityService.getAmenties() //the getAmenties method in communityService returns a promise 
                .success(function(data) {
                    _this.amenitylist = data;
                    // _this.refreshTable('amenityTable', _this.amenitylist);
                }).error(function(data) {
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
        }

        maintenanceexpenseSave() { //to save maintanance expense
            var _this = this;
            this.$http.get('/api/community/getLatLong')
                .success(function(data) {
                    _this.$http.post('api/paymentsrequests/maintenanceexpenseSave', {
                        paymentName: _this.expenseName,
                        paymentAmount: _this.amount,
                        paymentDate: _this.maintananceDate,
                        communityName: data.communityName,
                    })
                    _this.maintananceDetails();
                }).error(function(data) {
                    _this.toastr.error("Sorry! Something Went Wrong");
                });


        }

        addAmenity() { //adding the amenity to the particular community
            var _this = this;
            var communityId = this.communityId;
            var amenityname = this.amenityname;
            var amenitydescription = this.amenitydescription;
            var chargePerHour = this.chargeperhour;
            var personName = this.name;
            var contactNumber = this.contactnumber;
            this.$http.post('/api/amenities/create', {

                'amenityName': amenityname,
                'description': amenitydescription,
                'chargePerHour': chargePerHour,
                'contactPerson': {
                    'name': personName,
                    'contactPhone': contactNumber
                },
                'adminCommunityId': communityId,
                'timeInterval': this.timeInterval,
                'availableBookFrom': this.bookingFrom,
                'availableBookTo': this.bookingTo
            }).success(function(data) {
                // row.amenityId = data.amenityId;
                // _this.amenityRow = row;
                _this.amenitylist.push(data);
                // _this.refreshTable('amenityTable', _this.amenitylist);
                _this.amenityname = '';
                _this.amenitydescription = '';
                _this.name = '';
                _this.chargeperhour = null;
                _this.contactnumber = null;
                _this.toastr.success('Amenities Added Succesfully!', 'Success');
                // _this.showAmenity = 'true';
            }).error(function(data) {
                _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
            });

        }



        // refreshTable(tableName, data) {
        //     switch (tableName) {
        //         case 'floorsTable':
        //             this.floorTable = new this.NgTableParams({
        //                 page: 1,
        //                 count: 5
        //             }, {
        //                 dataset: data,
        //                 counts: []

        //             });
        //             break;

        //         case 'amenityTable':
        //             this.amenityTable = new this.NgTableParams({
        //                 page: 1,
        //                 count: 5
        //             }, {
        //                 dataset: data,
        //                 counts: []

        //             });

        //             break;
        //             //   case 'communityMembersTable' : 
        //             // this.amenityTable = new this.NgTableParams({
        //             // page : 1,
        //             // count : 5
        //             // }, {
        //             //     dataset : data,
        //             //     counts  :[]

        //             // });

        //             // break;
        //         case 'blocksTable':
        //             this.blockTable = new this.NgTableParams({
        //                 page: 1,
        //                 count: 3,
        //                 sorting: { blockName: 'asc' }
        //             }, {
        //                 dataset: data,
        //                 counts: []
        //             });
        //     }

        // }


        deleteAmenity(list) { //deleting the amenity from the particular community
            var _this = this;
            this.$http.post('/api/amenities/deleteAmenity', { amenityId: list.amenityId })
                .success(function() {
                    var i = 0;
                    for (; i < _this.amenitylist.length; i++) {
                        if (_this.amenitylist[i].amenityId === list.amenityId) {
                            _this.amenitylist.splice(i, 1);
                            break;
                        }
                    }
                    // _this.refreshTable('amenityTable', _this.amenitylist);
                    _this.toastr.warning('Selected Amenity is Deleted!', 'Warning');
                }).error(function(data) {
                    _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
                });
        }

        searchAmenityTable() { //search in ng-amenitytable
            if (this.userEntered !== '') {
                var i = 0;
                this.userEnters = this.userEntered.toLowerCase();

                for (; i < this.amenitylist.length; i++) {
                    var amenityname = this.amenitylist[i].amenityName.toLowerCase();
                    var contactPersonName = this.amenitylist[i].contactPerson.name.toLowerCase();
                    var result = amenityname.startsWith(this.userEnters) ||
                        contactPersonName.startsWith(this.userEnters) ||
                        this.amenitylist[i].contactPerson.contactPhone.startsWith(this.userEnters);
                    if (result === true) {
                        this.searchresult = [];
                        this.searchresult = this.amenitylist[i];
                        this.searchresults.push(this.searchresult);
                    }
                }
                // this.refreshTable('amenityTable', this.searchresults); //push the selected rows
                this.searchresults = [];
            } else {
                // this.refreshTable('amenityTable', this.amenitylist);
            }
        }

        addFloor(blockName) { //adding the floors to thr particular community
            var _this = this;
            this.floorAddResult = '';
            this.floorNumber = this.user.floorNumber;
            // var selectedblocks = this.userSelectedBlock;
            // _this.blockName = selectedblocks.blockName;
            this.flatNumbers = this.user.flatNumbers;
            this.startflatnumbers = this.user.startflatnumbers;
            this.lastflatnumbers = this.user.lastflatnumbers;
            // var  flatNumbersArray = this.user.flatNumbers.split(',');
            var isFloorExist = true;

            // if (selectedblocks.floors !== undefined) {
            //     for (var j = 0; j < selectedblocks.floors.length; j++) { //loop for retrieving the floornumbers in user selectedblock
            //         this.floorNumberArray[j] = selectedblocks.floors[j].floorNumber;
            //     }

            //     for (var k = 0; k < this.floorNumberArray.length; k++) //comparing the floornumberarray with the userfloornumber array
            //     {
            //         if (_this.user.floorNumber === this.floorNumberArray[k]) { //comparing the user enterd floornumbers 
            //             // alert("Sorry Already Exist FloorNumber:"+_this.user.floorNumber);
            //             isFloorExist = true;
            //         }
            //     }
            // }
            if (isFloorExist === true) {
                var i = 1;
                for (; i <= this.floorNumber; i++) {
                    this.floornumberone = i;
                    this.flatNumbersArray = [];
                    if (this.startflatnumbers == null || this.startflatnumbers == undefined) {
                        for (var j = 1; j <= this.flatNumbers; j++) {
                            this.number = i + '00';
                            this.flatNumberStart = parseInt(this.number);
                            this.flatNumbersArray.push(this.flatNumberStart + j);
                        }
                    } else {
                        for (var j = 1; j <= this.flatNumbers; j++) {
                            if (this.startflatnumbers <= this.lastflatnumbers) {
                                this.number = this.startflatnumbers;
                                this.flatNumberStart = parseInt(this.number);
                                this.flatNumbersArray.push(this.flatNumberStart);
                                this.startflatnumbers++;
                            }
                        }
                    }
                    var row = {};
                    _this.addFloorRow = {};
                    row.floorNumber = this.floornumberone;
                    row.flatNumbers = this.flatNumbersArray;
                    _this.addFloorRow.floorNumber = this.floornumberone;
                    _this.addFloorRow.flatNumbers = this.flatNumbersArray;
                    var k = 0;
                    for (; k < _this.blocksList.length; k++) {
                        if (_this.blocksList[k].blockName === _this.blockName) {
                            if (_this.blocksList[k].floors === undefined)
                                _this.blocksList[k].floors = [];
                            _this.blocksList[k].floors.push(_this.addFloorRow);

                            break;
                        }
                    }
                    console.log(this.flatNumbersArray)
                    this.$http.post('/api/community/floors', {
                        // 'id': this.communityId,
                        'blockName': blockName,
                        'floorNumber': this.floornumberone,
                        'flatNumbers': this.flatNumbersArray
                    }).success(function(data) {
                        _this.MaintainenceTable();
                    }).error(function(data) {
                        _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
                    });
                }
            }
            //_this.getBlocks();
        }

        entered() {
            if(this.flatNumberSearch !='') {
            var _this = this;
             this.showFirstTable=false;
             this.searchtable=true;
             _this.maintenanceArraySelected  = [];
            this.$http.post('/api/floors/flatnumberSearch', {
                keyword: this.flatNumberSearch
            }).success(function(data) {
                _this.maintenanceArraySelected = data;
            }).error(function(data) {
                _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
            })
          }
          else{
             this.maintenanceArraySelected  = [];
             this.toastr.warning('Sorry No results are founded');
             this.showFirstTable=true;
             this.searchtable=false;
          }
        }


        BulkEditSave(){
            var _this = this;
            console.log(this.maintenanceArraySelected)
            this.$http.post('/api/floors/bulkEditSave',{
                 array:this.maintenanceArraySelected,
                 flatType:this.flatType,
                 cost:this.maintenanceCost
            }).success(function(data)
            {
                 _this.entered(); 
                _this.toastr.success('Succesfully,updated'); 
            })
            
        }

        selectBlockName() { //displaying the floor and flatnumbers based on the blocks 
            var _this = this;
            var selectedblocks = this.userSelectedBlock;
            window.slctblock = selectedblocks.blockName;
            _this.blokName = window.slctblock;
            this.floorLength = this.userSelectedBlock.floors.length;
            // this.refreshTable('floorsTable', selectedblocks.floors);
        }


        selectBlock(blocks) { //displaying the floor and flatnumbers based on the blocks 
            var _this = this;
            this.userSelectedBlock = [];
            _this.floorss = true;
            this.blockks = blocks;
            var selectedblocks = this.blockks;
            _this.blokName = _this.blockks.blockName;
            this.floorLength = selectedblocks.floors.length;
            _this.als = selectedblocks.floors;
            // _this.user.floorNumber = '';
            //            _this.user.flatNumbers = null;
            // this.refreshTable('floorsTable', selectedblocks.floors);
        }

        deleteFloor(floorNum) { //adding the floor from the particular community
            var _this = this;
            this.als1 = [];
            // var communityId = this.communityId;
            // var selectedblocks = this.userSelectedBlock;
            // _this.deletingFloor = row;
            _this.selectedBlockName = this.blockks.blockName;
            // var blockName = selectedblocks.blockName;
            // var floorNumber = blockName.floorNumber;
            this.$http.delete('/api/community/floors', {
                params: {
                    //"id": communityId,
                    'blockName': _this.selectedBlockName,
                    'floors': floorNum
                }
            }).success(function() {
                var i = 0;
                var deleted = false;
                for (; i < _this.blocksList.length; i++) {
                    if (_this.blocksList[i].blockName === _this.selectedBlockName) {
                        for (var j = 0; j < _this.blocksList[i].floors.length; j++) {

                            if (_this.blocksList[i].floors[j].floorNumber === floorNum) {
                                _this.blocksList[i].floors.splice(j, 1);
                                _this.als1 = _this.blocksList[i].floors;
                                _this.als = _this.als1;
                                deleted = true;
                                break;
                            }
                        }
                        if (deleted) {
                            break;
                        }
                    }

                }

                // _this.refreshTable('floorsTable', _this.blocksList[i].floors);
                // _this.deletingFloor = '';
                _this.toastr.warning('Floors Deleted Succesfully!', 'warning');
            }).error(function() {
                _this.floorAddResult = 'Error in deleting Floor';
                _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
            });
            _this.getBlocks();
        }




        addBlock(blockName) { //adding the block to the particular community
            var _this = this;
            _this.warning = "Block Already Exists";
            if (_this.blockNames.includes(blockName)) {
                return _this.warning;
            }
            _this.warning = '';
            _this.showBlock = false;
            _this.showErr = false;
            var flag = false;
            _this.addBlockRow = {};
            _this.addBlockRow.blockName = blockName;
            for (var i = 0; i < _this.blocksList.length; i++) {

                if (_this.addBlockRow.blockName === _this.blocksList[i].blockName) {
                    _this.showErr = true;
                    _this.blockInfo = 'AlreadyBlock Exist';
                    flag = true;
                }
                if (_this.addBlockRow.blockName === null || undefined) {
                    _this.blockInfo = 'Please enter the blockName';
                    return;
                    flag = true;
                }
            }
            if (flag === false) {
                _this.blockInfo = '';
                this.$http.post('/api/community/blocks', {
                    'blocks': {
                        'blockName': blockName,
                    }
                }).success(function() {
                    //_this.blocksList.push(_this.addBlockRow);
                    // _this.user.blockName = null;
                    //_this.toastr.success('Block Added Succesfully!', 'Success');
                    _this.addFloor(blockName);
                    _this.getBlocks();
                }).error(function(data) {
                    _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
                });
            }
        }

        getBlocks() { //displaying the blocks based on th communityid
            var _this = this;
            this.emptyfloorsList = [];
            this.blockNames = [];
            this.communityMembersList = ['Secretary', 'JointSecretary', 'Treasurer', 'CommunityMembers']; //to populate the dropdown for memebers form
            this.CommunityService.getBlocks() //the getBlocks method in communityService returns a promise 
                .success(function(data) {
                    _this.blocksList = data.blocks;
                    for (var i = 0; i < data.blocks.length; i++) {
                        _this.blockNames.push(data.blocks[i].blockName);
                    }
                    //         _this.blockNames.push(); 
                    // for(var i=0;i<_this.blocksList.length;i++){
                    //     if(_this.blocksList[i] != null){
                    //         _this.blockNames=[];
                    //         _this.blockNames.push(); 
                    //     }
                    //  else if(_this.blocksList[i].floors.length==0 || _this.blocksList[i].floors.length== undefined){
                    //         _this.emptyfloorsList.push(_this.blocksList[i]);
                    //     } 
                    // }

                    // _this.refreshTable('blocksTable', _this.blocksList);

                }).error(function(data) {
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
        }


        populateResident(block) { //blockname in block
            var _this = this;
            _this.showResidents = true;
            _this.block = block;
            this.$http.post('/api/community/populateResident', {
                blockName: block
            }).success(function(data) {
                console.log(data);
                // _this.blockResidents=[];
                // for(var i=0; i<data.length; i++){

                _this.blockResidents = data;
                // }
            }).error(function(data) {
                _this.toastr.error("Sorry! Something Went Wrong");
            });

        }



        deleteBlock(blockss) { //deleting the block from the particular community
            var _this = this;
            var blockName = blockss;
            _this.deletedBlock = blockss;
            this.$http.delete('/api/community/blocks', {
                params: {
                    // "id"       : this.communityId,
                    'blockNames': blockName
                }
            }).success(function() {
                for (var i = 0; i < _this.blocksList.length; i++) {
                    if (_this.blocksList[i].blockName === _this.deletedBlock) {
                        _this.blocksList[i].floors = [];
                        // _this.refreshTable('floorsTable', _this.blocksList[i].floors);
                        _this.blocksList.splice(i, 1);
                        break;
                    }
                }
                // _this.refreshTable('blocksTable', _this.blocksList);
                _this.toastr.warning('Blocked Deleted Succesfully!', 'warning');
            }).error(function(data) {
                _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
            });
            _this.getBlocks();
        }

        searchBlockTable() { //search in ng-amenitytable
            if (this.userEnter !== '') {
                this.userEnters = this.userEnter.toLowerCase();
                var i = 0;
                for (; i < this.blocksList.length; i++) {
                    var blockName = this.blocksList[i].blockName.toLowerCase();
                    var result = blockName.startsWith(this.userEnters) ||
                        this.blocksList[i].floors.length === this.userEnters;
                    if (result === true) {
                        this.searchresult = [];
                        this.searchresult = this.blocksList[i];
                        this.searchresults.push(this.searchresult);
                    }
                }
                // this.refreshTable('blocksTable', this.searchresults); //push the selected rows
                this.searchresults = [];
            } else {
                // this.refreshTable('blocksTable', this.blocksList);
            }
        }


        memberSuggestion() { //search box in communitymemberform
            var _this = this;
            this.$http.post('/api/users/suggestions', { keyword: this.communityMemberName }) //contains user selected community name
                .success(function(data) {
                    _this.totalResult = data;
                    _this.searchoptions = [];
                    _this.result = [];
                    var i = 0;
                    for (; i < data.length; i++) {
                        _this.searchoptions.push(data[i].firstName + ',' + data[i].houseNumber);
                        //pushes the user, address1 and flatnumber to the user in search box
                    }
                }).error(function(data) {
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
        }


        selectedUserName() { //after selecting  the username,getting the respective data
            var _this = this;
            this.userName = this.communityMemberName.split(',');
            this.$http.post('/api/users/selecteduserName', {
                firstName: this.userName[0],
                houseNumber: this.userName[1]
            }).success(function(data) {
                _this.userEmail = data[0].email;
                _this.userPhoneNumber = data[0].phoneNumber;
                _this.userId = data[0].userId;
            }).error(function(data) {
                _this.toastr.error("Sorry! Something Went Wrong");
            });
        }



        addCommMember() { //create a communitymember
            var _this = this;
            this.showSuccess = false;
            this.showFail = false;
            this.userName = this.communityMemberName.split(',');
            this.communitymembersInfo = [];
            if (this.toDate == null) {
                this.endDate = null;
            } else {
                this.endDate = this.toDate;
            }
            this.$http.post('/api/communitymembersmappings/createmember', {
                name: this.userName[0],
                userId: _this.userId,
                emailId: _this.userEmail,
                phoneNumber: _this.userPhoneNumber,
                roleType: this.designation,
                fromDate: this.fromDate1,
                endDate: this.endDate1
            }).success(function(data) {
                _this.toastr.success('Succesfully Saved your Member!', 'Successfull');
                _this.communityMemberName = null;
                _this.designation = null;
                _this.fromDate1 = null;
                _this.toDate1 = null;
                _this.showSuccess = true;
                //_this.successdata = 'Succesfully Saved your Member';
                // _this.refreshTable('communityMembersTable', _this.communitymembersInfo)
            }).error(function() {
                _this.toastr.error('Email Is Already In use!', 'Failed');
                _this.showFail = true;
                //_this.successdata = 'Email Is Already In use';
            });
        }


        maintenance() {
            var _this = this;
            this.$http.post('/api/community/maintenanceInfo', {
                maintenanceCost: this.maintainenceCost,
                maintenanceDate: this.selectedDate
            }).success(function() {
                _this.showAlert = 'true';

                _this.toastr.success('Saved Your Maintainence Details!', 'Success');
                _this.maintainenceCost = null;
                _this.maintainenceDate = null;
                // _this.maintainenceStatus = 'Successfully Saved Your Maintenance Details';
            }).error(function() {
                _this.showError = 'true';
                _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
                // _this.maintainenceStatus = 'Sorry,not Saved';
            });
        }


    }

    angular.module('guwhaApp')
        .component('settings', {
            templateUrl: 'app/dashboard/settings/settings.html',
            controller: SettingsComponent
        });

})();
