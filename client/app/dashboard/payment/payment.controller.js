'use strict';
(function() {

    class PaymentComponent {
        constructor($http, Auth, $location, CommunityService, toastr) {
            this.$http = $http;
            this.$location = $location;
            this.Auth = Auth;
            this.totalExpAmoArray = [];
            this.toastr = toastr;
            this.user = {
                roles: []
            };
            this.CommunityService = CommunityService;
            this.getuserPayments();
            this.getPaidPayments();
            // this.getShaKey();
        }

        exist(expenses) {
            var _this = this;
            return _this.totalExpAmoArray.indexOf(expenses) > -1;
        }

        getPaidPayments() {
            var _this = this;
            this.$http.get('/api/expenses/getPaidPayments')
            .success(function(data)
            {
                _this.getpaidpayments = [];
                _this.getpaidpayments = data;
            })
            .error(function(data)
            {
                _this.toastr.error("Sorry! Something Went Wrong");
            })
        }

        paymentSelected(expenses) {
            var _this = this;
            var idx = _this.totalExpAmoArray.indexOf(expenses);
            if (idx > -1) {
                _this.totalExpAmoArray.splice(expenses, 1)
            } else {
                _this.totalExpAmoArray.push(expenses)
                console.log(_this.totalExpAmoArray);
            }
        }

        paypayments() {
            var _this = this;
            _this.totalExpAmount = 0;
            for (var i = 0; i < _this.totalExpAmoArray.length; i++) {
                _this.amount = _this.totalExpAmoArray[i].expenseAmount;
                _this.totalExpAmount = _this.totalExpAmount + _this.amount;
            }
            this.goPayments();
        }

        goPayments() {
            var _this = this;
            _this.getResponseArray = [];
            this.amount = _this.totalExpAmount;
            this.surl = "http:localhost:9000/payments";
            this.furl = "www.gmail.com";
            this.service_provider = "payu_paisa";
            this.$http.post('/api/expenses/getShaKey', {
                amount: this.amount,
                surl: this.surl,
                furl: this.furl,
                service_provider: this.service_provider,
                totalpaymentsselected: this.totalExpAmoArray
            }).success(function(data) {
                var getResponse = data.shaKey;
                _this.getResponseArray = getResponse.split('-');
                _this.txnid = _this.getResponseArray[1];
                _this.key = _this.getResponseArray[3];
                _this.amount = _this.getResponseArray[4];
                _this.productinfo = _this.getResponseArray[2];
                _this.firstname = _this.getResponseArray[5];
                _this.phone = _this.getResponseArray[7];
                _this.surl = "http:localhost:9000/api/expenses/successPayumoney";
                _this.furl = "www.gmail.com";
                _this.encrypttext = _this.getResponseArray[0];
                _this.service_provider = "payu_paisa";
                _this.email = _this.getResponseArray[6];

            })
        }
        getuserPayments() {
            var _this = this;
            var date = new Date();
            date.setHours(0, 0, 0, 0)
            var month = date.getMonth() - 1; ///setting last month to up to date
            var setdate = new Date();
            if (month == 0) {
                setdate.setMonth(11);
            } else {
                setdate.setMonth(month);
            }
            setdate.setDate(1);
            setdate.setHours(0, 0, 0, 0);
            this.todate = date;
            this.fromDate = setdate;
            _this.paymentsArray = [];
            this.$http.get('/api/expenses/getuserPayments')
                .success(function(data) {
                    console.log(data);
                    _this.paymentsArray = data;
                    _this.resultaraary = [];
                }).error(function(data) {
                    _this.toastr.error("Sorry! Something Went Wrong");
                });

        }

        // exist(x) {
        //      var _this = this;
        //    return   _this.resultaraary.indexOf(x) > -1;
        //  }
        check(value, checked) {
            this.amount = 0;
            alert(checked);
            var idx = this.user.roles.indexOf(value);
            if (idx >= 0 && !checked) {
                this.amount = parseInt(this.total - value.expenseAmount);
                this.user.roles.splice(idx, 1);
            }
            if (idx < 0 && checked) {
                this.amount = parseInt(this.amount + value.expenseAmount);
                this.user.roles.push(value);
            }
            this.total = this.amount;
        }

        getRoles() {
            return this.user.roles;
        };
        // expenseSelected(x) {
        //      this.amount = 0;
        //     var _this = this;
        //     var idx =    _this.resultaraary.indexOf(x);
        //      if(idx > -1){
        //         _this.resultaraary.splice(x,1)
        //         console.log(_this.resultaraary);
        //           _this.amount = _this.sai -  x.expenseAmount;
        //         if(_this.resultaraary.length == 0){
        //              _this.amount = 0;
        //                alert("hi");
        //   }      
        //     }

        //     else {
        //         _this.resultaraary.push(x)
        //         console.log(_this.resultaraary);
        //          for(var i=0;i<_this.resultaraary.length;i++){
        //           _this.amount = _this.amount + _this.resultaraary[i].expenseAmount
        //       }
        //     }
        //     _this.sai = _this.amount;    


        //     // for(var i=0;i<_this.resultaraary.length;i++){
        //     //        _this.sai = 0 + _this.resultaraary[i];
        //     // }
        // }




    }

    angular.module('guwhaApp')
        .component('payment', {
            templateUrl: 'app/dashboard/payment/payment.html',
            controller: PaymentComponent
        });

})();
