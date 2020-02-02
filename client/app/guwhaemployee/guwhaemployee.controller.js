'use strict';
(function() {

    class GuwhaEmployeeComponent {
        constructor($http, Auth,toastr) {
            this.$http = $http;
            this.toastr = toastr;
            this.Auth = Auth;
            this.getPayuIdPayments();
        }



        payPayment() {
            var _this = this;
            this.$http.post('/api/expenses/payPayment',{
                expenseId : this.expenseId,
                paymentSource: this.paymentSourceSelcted,
                status:this.statusSelcted,
                antransId:this.antransId
            }).success(function(data)
            {
                   _this.toastr.success("Saved the payment details");
                 _this.getPayuIdPayments();
              
            }).error(function(data)
            {
                _this.toastr.error("Sorry! please try Again");
            })
        }

        getPayuIdPayments() {
            alert("hello");
            this.paymentSource = ["PyUmoney","Frrecharge","Mobikwik","Paytm"];
            this.status = ["Paid"];
            var _this = this;
            this.$http.get('/api/expenses/getPayuIdPayments')
            .success(function(data)
            {
                 _this.getPayuIdPayment = data;
                console.log(data);
            }).error(function(data)
            {
                _this.toastr.error("Sorry! Something Went Wrong");
                console.log(data);
            })
        }

        processPayment(x) {
            var _this = this;
            this.$http.post('/api/expenses/processPayment',{
                expenseId:x.expenseId
            }).success(function(data)
            {
                  _this.expenseId = data.expenseId;
                _this.transId = data.transId;
                _this.userId  = data.userId;
                _this.communityId = data.communityId;
                _this.expenseName = data.expenseName;
                _this.payuId = data.payuId;
            }).error(function(data)
            {
                console.log(data);
            })
        }




    }

    angular.module('guwhaApp')
        .component('guwhaemployee', {
            templateUrl: 'app/guwhaemployee/guwhaemployee.html',
            controller: GuwhaEmployeeComponent
        });

})();
