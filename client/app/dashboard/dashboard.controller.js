	'use strict';
(function() {

    class DashboardComponent {

        constructor(Auth, $location, $http, NgTableParams, $rootScope, toastr) {
            this.$http = $http;
            this.toastr = toastr;
            this.$location = $location;
            this.NgTableParams = NgTableParams;
            this.activeUsercount = 0;
            this.inactiveUserCount = 0;
            this.complaintCount = 0;
            this.serProRequestCount = 0;
            this.visitorTable = new NgTableParams({
                page: 1,
                count: 10
            }, {
                dataset: []
            });
            this.userVisitorsTable = new NgTableParams({
                page: 1,
                count: 5
            }, {
                dataset: []
            });
            this.Auth = Auth;
            this.user = this.Auth.getCurrentUser(); 
            this.$rootScope = $rootScope;
            this.visitorslist = [];
            this.userVisitorsList = [];
            this.showBoxes = false;
            this.showTable = false;
            this.count = 0;
            // this.$rootScope.globalFirstName = this.Auth.getCurrentUser().firstName;
            // this.$rootScope.role = this.Auth.getRole();
            // this.User = this.Auth.getCurrentUser();
             this.loogedInrole =  this.Auth.getRole();
            this.firstName = this.Auth.getCurrentUser().firstName;
            // this.communityId = this.Auth.getCurrentUser().communityId;
            if (this.Auth !== undefined && this.Auth.isLoggedIn() === true) {} else {
                this.$location.path('/');
            }
            if ( this.loogedInrole == 'COMMUNITY_ADMIN') {
                this.communityAdminMethods();
                this.showAdmin = true;
            } else {
                this.userMethods();
                this.showUser = true;
            }
            this.section = [
                "Yearly",
                "Half-yearly",
                "Quarterly"
            ];
            this.days = [
                "Daily",
                "Monthly"
            ];

            this.colors = [
                "#22D1E4",
                "#FBC853",
                "#FF7694",
                "#0F3857",
                "#162531"
            ];
            this.legend = [];
            this.options = {
                segmentShowStroke : false,
                tooltips: {
                    enabled: false,
                    opacity: 0
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInBounce'
                }, 
                hover: {
                    mode: false
                },
                elements: {
                    arc: {
                        borderWidth: 0
                    }
                }
            };
            this.lineColor = ['#22D1E4', '#22D1E4', '#22D1E4', '#22D1E4','#22D1E4', '#22D1E4', '#22D1E4', '#22D1E4','#22D1E4', '#22D1E4', '#22D1E4', '#22D1E4'];
            this.barOptions = {
                tooltips: {
                    enabled: true,
                    opacity : 0
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInBounce'
                },
                hover: {
                    mode: false
                },
                scales: {
                    xAxes: [{ gridLines: { display: false } }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Expenses',
                            fontSize : 14
                        },
                        gridLines: { tickMarkLength: 10, display: false }
                    }]
                }
            };
        }

        highestVisitors() {
            var _this = this;
            _this.highestVisitorsArray = [];
            this.$http.get('/api/visitors/getHighestVisitors')
                .success(function(data) {
                    _this.highestVisitorsArray = data; 
                }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
        }


        serProRequests() {
            var _this = this;
            this.$http.get('/api/servProvRegists/getCount')
                .success(function(data) {
                    _this.serProRequestCount = data.length;
                })
                .error(function(data) {
                    _this.serProRequestCount = 0;
                })

        }

        communityMembers() {
            var _this = this;
            _this.communityMembersresult = [];
            this.$http.get('/api/communitymembersmappings/communitymemberslist')
                .success(function(data) {
                    _this.communityMembersresult = data; 
                    // _this.refreshTable('communitymemberstable', _this.result)
                })
                .error(function() {
                    _this.serProRequestCount = 0;
                });
        }

        refreshTable(tableName, data) {
            switch (tableName) {
                case 'visitorTable':
                    this.visitorTable = new this.NgTableParams({
                        page: 1,
                        count: 10,
                        sorting: {
                            flatNo: 'asc'
                        }
                    }, {
                        dataset: data,
                        counts: []
                    });
                    break;
                case 'userVisitorsTable':
                    this.userVisitorsTable = new this.NgTableParams({
                        page: 1,
                        count: 5,
                        sorting: {
                            blockName: 'asc'

                        }
                    }, {
                        dataset: data,
                        counts: []
                    });
            }
        }

        // getPayments() {    //user payments
        //     var _this = this;
        //     this.paymentNameArray = [];
        //     this.paymentAmountArray = [];
        //     this.$http.get('/api/paymentsrequests/getPayment')
        //     .success(function(data)
        //     {  
        //          _this.paymentNameArray = data;
        //     }).error(function(data)
        //     { 
        //     })
        // }

        // paymentsPay()//payments pay
        // {
        //     var _this = this;
        //     this.toastr.info('Sorry,feature is still in  development!','Information');

        // }

        activeUsersCount() {
            var _this = this;
            this.activeUsersCountArray = [];
            this.$http.get('/api/users/activeUsersCount')
                .success(function(data) {
                    _this.activeUsercount = data;
                }).error(function() {
                    _this.activeUsercount = 0;
                });
        }

        ExpensesDetails() { //user expenses 
            this.communityExpen=false;
            this.userExpen = true;
            var _this = this;
             _this.legend = [];
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
            this.fromDate = fDate.setDate(1);
            this.toDate = new Date();
            this.$http.post('/api/expenses/ExpensesDetailsMonthly', {
                fromDate: this.fromDate,
                toDate: this.toDate
            }).success(function(data) {

                for (var i = 0; i < data.length; i++) {
                    _this.result = data[i]._id;
                    _this.category = _this.result.Respectiveinfo[0].category;
                    _this.totalCost = data[i].totalAmount;
                    _this.CategoryNamesArray.push(_this.category);
                    _this.totalCostArray.push(_this.totalCost);
                    _this.legendOptions = {
                        title: _this.category,
                        color: _this.colors[i]
                     };
                  _this.legend.push(_this.legendOptions);
                }


            }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
        }

        communityExpensesDetails() { //communityAdmin expenses
            // this.options = {legend: {display: true}}; 
            this.communityExpen=true;
            this.userExpen = false;
            var _this = this;
            _this.legend = [];
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
            this.CategoryNamesArray = [];
            this.totalCostArray = [];
            var fDate = new Date();
            this.fromDate = fDate.setDate(1);
            this.toDate = new Date();
            this.$http.post('/api/expenses/communityExpenses', {
                fromDate: this.fromDate,
                toDate: this.toDate
            }).success(function(data) {
                console.log(data);
                for (var i = 0; i < data.length; i++) {
                    _this.result = data[i]._id;
                    _this.category = _this.result.Respectiveinfo[0].category;
                    _this.totalCost = data[i].totalAmount;
                    _this.CategoryNamesArray.push(_this.category);
                    _this.totalCostArray.push(_this.totalCost);
                    _this.legendOptions = {
                        title: _this.category,
                        color: _this.colors[i]
                     };
                     _this.legend.push(_this.legendOptions);
                }
            }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                }); 
        }

        monthlyGroupVisitor() { //herewe get the visitors (monthly)
            var _this = this;
            _this.namesMonthArray = [];
            _this.totalVisitorsArray = [];
            this.dailyVisitors = false;
            this.monthlyVisitors = true;
            this.$http.get('/api/visitors/getMonthlyVisitors')
                .success(function(data) {
                    for (var i = 0; i < data.length; i++) { 
                        _this.monthNumber = data[i]._id.month;
                        _this.namesMonth = _this.monthNames[_this.monthNumber - 1];
                        _this.totalVisitors = data[i].count;
                        _this.namesMonthArray.push(_this.namesMonth);
                        _this.totalVisitorsArray.push(_this.totalVisitors);
                    }

                       for(var i=0;i<_this.monthNames.length;i++){
                          if(_this.namesMonthArray.indexOf(_this.monthNames[i])==-1){
                              _this.category = _this.monthNames[i];
                            _this.visitorCount = "0";
                            _this.namesMonthArray.push(_this.category);
                             _this.totalVisitorsArray.push(_this.visitorCount);
                           }
                    }
                })
        }

        monthlyExpenses() { //Monthly expenses(group by month)
            var _this = this;
            _this.monthNameForGroup = [];
            _this.totalAmountArray = [];
            _this.max = 0;
            this.monthlyGroupGrph = true; //shows the monthly group graph
            this.yearlygroupgraph = false;
            this.sixmonthsgroupgraph = false;
            this.currentDate = new Date();
            this.$http.post('/api/expenses/groupMonthlyExpenses', {
                    currentDate: this.currentDate
                })
                .success(function(data) { 
                    for (var i = 0; i < data.length; i++) {
                        _this.monthvalue = data[i]._id.month;
                        _this.monthname = _this.monthNames[_this.monthvalue - 1];
                        _this.monthNameForGroup.push(_this.monthname);
                        _this.totalAmountArray.push(data[i].total);
                        if (_this.max < data[i].total) {
                            _this.max = data[i].total;
                        }
                    }

                    for (var i = 0; i < _this.monthNames.length; i++) {
                        if (_this.monthNameForGroup.indexOf(_this.monthNames[i]) == -1) {
                            _this.category = _this.monthNames[i];
                            _this.totalCost = "0";
                            _this.monthNameForGroup.push(_this.category);
                            _this.totalAmountArray.push(_this.totalCost);
                        }
                    }

                }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
        }


        expensesGraph(part, index) {
            var _this = this;
            var index = index;
            this.part = part;

            if (part == 'Quarterly') {
                this.sixMonthsExpenses(4);
                _this.selected = index;
                _this.selectedCat = part;
            } else if (part == 'Half-yearly') {
                this.sixMonthsExpenses(6);
                _this.selected = index;
                _this.selectedCat = part;
            } else if (part == 'Yearly')
                this.monthlyExpenses();
            _this.selected = index;
            _this.selectedCat = part; 
        }

        visitorGraph(day, index) {
            var _this = this;
            var index = index;

            if (day == 'Daily') {
                this.getVisitors();
                _this.select = index;
            } else if (day == 'Monthly') {
                this.monthlyGroupVisitor();
                _this.select = index;
            }
        }

        expensesCall(option, index){
            var _this = this;
             var index = index;
             _this.option = option;

            if (option == 'CommunityExpenses') {
                this.communityExpensesDetails();
                _this.choosed = index;
            } else if (option == 'Expenses') {
                this.ExpensesDetails();
                _this.choosed = index;
            }

        }

        sixMonthsExpenses(month) {
            var _this = this;
            this.month = month;
          this.monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec","Jan","Feb","Mar","Apr","May",
                "Jun","Jul","Aug","Sep","Oct","Nov","Dec"
            ];
            this.fourMonthArray = [];     
            if(_this.month == 4){                    //dynamic push 
             var fourMonthsAgo = moment().subtract(4, 'months');
              var number = fourMonthsAgo.month()+1;
              var i=parseInt(number);
              console.log(i);
              var  s = parseInt(number+4);
              console.log(s);   
              for(;i<s;i++){
                   _this.fourMonthArray.push(_this.monthNames[i])
             }      
          }
          else{                             //dynamic push 
            var fourMonthsAgo = moment().subtract(6, 'months');
              var number = fourMonthsAgo.month()+1;
              var i=parseInt(number);
              console.log(i);
              var  s = parseInt(number+6);
              console.log(s);   
              for(;i<s;i++){
                   _this.fourMonthArray.push(_this.monthNames[i])
             }      
          }
           console.log(_this.fourMonthArray);
            _this.sixmonthName = [];
            _this.sixMonthAmount = [];
            this.sixmonthsgroupgraph = true;
            this.monthlyGroupGrph = false; //shows the monthly group graph
            this.yearlygroupgraph = false;
            this.$http.post('/api/expenses/sixMonthsExpense', {
                    months: this.month
                })
                .success(function(data) {
                    for (var i = 0; i < data.length; i++) {
                        _this.monthvalue = data[i]._id.month;
                        _this.monthname = _this.monthNames[_this.monthvalue - 1];
                        _this.sixmonthName.push(_this.monthname);
                        _this.sixMonthAmount.push(data[i].total);
                        if (_this.max < data[i].total) {
                            _this.max = data[i].total;
                        }
                    }
                for (var i = 0; i < _this.fourMonthArray.length; i++) {         //dynamic push 
                        if (_this.sixmonthName.indexOf(_this.fourMonthArray[i]) == -1) {
                            _this.category = _this.fourMonthArray[i];
                            _this.totalCost = "0";
                            _this.sixmonthName.push(_this.category);
                            _this.sixMonthAmount.push(_this.totalCost);
                        }
                    }
                }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
        }


        communityMembersCount() {
            var _this = this;
            this.$http.get('/api/communitymembersmappings/membersCount')
                .success(function(data) {
                    _this.communitymembersCount = data;
                }).error(function() {
                    _this.communitymembersCount = 0;
                });
        }

        inactiveUsersCount() {
            var _this = this;
            this.$http.get('/api/approvals/inactive')
                .success(function(data) {
                    _this.inactiveUserCount = data.length;
                }).error(function(data) { 
                    _this.inactiveUserCount = 0;
                });
        }
        complaintsCount() {
            var _this = this;
            this.$http.get('/api/complaints/count')
                .success(function(data) { 
                    _this.complaintCount = data.length;
                }).error(function() {
                    _this.complaintCount = 0;
                });
        }


        //here we get the count of the visitors   
        visitorsCount() {
            var _this = this;
            this.$http.post('/api/visitors/visitorsCount')
                .success(function(data) {
                    _this.visitorsCount = data;
                }).error(function() {
                    _this.visitorsCount = 0;
                });
        }


        //here we get the visitors(daily)
        getVisitors() {
            var _this = this;
            this.dailyVisitors = true;
            this.monthlyVisitors = false;
            this.$http.get('/api/visitors/getVisitors')
                .success(function(data) {
                    _this.visitorslist = data; 
                }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
        }



        skipped() {
            var _this = this;
            this.$http.post('/api/visitors/getSkippedVisitors')
                .success(function(data) {
                    _this.visitorslist = data;
                }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });

        }
        previousVisitors() {
            var _this = this; 
            var count = parseInt(this.count);
            count--;
            this.count = count; 
            this.$http.post('/api/visitors/getSkippedVisitors', {
                count: count
            }).success(function(data) {
                _this.visitorslist = data;
            }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
        }




        //here we get RESIDENT specific visitors 
        userVisitors() {
            var _this = this;
            this.$http.post('/api/visitors/userVisitors')
                .success(function(data) {
                    _this.userVisitorsList = data;
                    _this.refreshTable('userVisitorsTable', _this.userVisitorsList);
                }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
        }

        userSkipped() {
            var _this = this;
            var count = parseInt(this.count);
            count++;
            this.count = count;
            this.$http.post('/api/visitors/userSkippedVisitors', {
                    count: count
                })
                .success(function(data) {
                    _this.userVisitorsList = data;
                }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
        }

        previousUserVisitors() {
            var _this = this;
            var count = parseInt(this.count);
            count--;
            this.count = count;
            this.$http.post('/api/visitors/userSkippedVisitors', {
                    count: count
                })
                .success(function(data) {
                    _this.userVisitorsList = data;
                }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
        }


        //here we delete the visitors
        deleteVisitor(row) {
            var _this = this;
            //var visitorId = row.visitorId;
            this.$http.post('/api/visitors/deleteVisitor', {
                    visitorId: row.visitorId
                })
                .success(function() {
                    for (var i = 0; i < _this.visitorslist.length; i++) {
                        if (_this.visitorslist[i].visitorId === row.visitorId) {
                            _this.visitorslist.splice(i, 1);
                            break;
                        }
                        _this.refreshTable('visitorTable', _this.visitorslist);
                    }
                }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
        }

        go(path) {
            this.$location.path(path);
        }

        communityAdminMethods() {
            this.activeUsersCount();
            this.getVisitors();
            this.inactiveUsersCount();
            this.complaintsCount();
            this.serProRequests();
            this.highestVisitors();
            this.communityMembers();
            //this.monthlyExpenses();
            this.expensesGraph('Yearly', 0);
            this.communityExpensesDetails(); //communityexpenses
        }

        userMethods() {
            //this.communityExpensesDetails(); //communityexpenses
            //this.ExpensesDetails(); //userexpenses
            //this.monthlyExpenses();
            this.getVisitors();
            this.categoryList = ['Food', 'Clothes', 'Fuel','House', 'Groceries', 'Mobile/Internet', 'Transportation'];
            this.expensesGraph('Yearly', 0);
            this.expenseArray= [
                "CommunityExpenses",
                "Expenses"                
            ];
            this.expensesCall('Expenses', 1); 
        }

    }


    angular.module('guwhaApp')
        .component('dashboard', {
            templateUrl: 'app/dashboard/dashboard.html',
            controller: DashboardComponent,
            authenticate: true
        });
    
    

})();
