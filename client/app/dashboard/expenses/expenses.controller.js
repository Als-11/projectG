'use strict';
(function() {

    class ExpensesComponent {
        constructor($http, Auth, toastr, $location) {
            this.$http = $http;
            this.Auth = Auth;
            this.$location = $location;
            // this.$anchorScroll = $anchorScroll;
            this.toastr = toastr;
            this.loggedInRole = this.Auth.getCurrentUser().role;
            this.expensesShow = [];
            this.totalexpenseCard = true;
            this.data();
            this.recurring = true;
            this.getExpenses();

        }
        data() {
            this.categoryList = ['Food', 'Clothes', 'Fuel','House', 'Groceries', 'Mobile/Internet', 'Transportation','Maintenance','Others'];
            this.expensePaidStatus = ['Paid', 'Pending'];
            this.totalExpAmoArray = [];
            // this.form = true;
            // this.forms = false;
            this.preshowexpenseCard = true;
            // var a =new Date().getDate(); 
            // var limiit = new Date().setDate(a-1);
            // this.limit = new Date(limiit).toString();
        }
        expenseForm(expense){
            // this.sudheer = false;
            this.showexpenseCard = true;
            this.preshowexpenseCard = false;
            this.totalexpenseCard = false;
        if(expense == 1){
            this.selectedCategory = "Others";
            expense =  this.selectedCategory;
        }
        else{
           this.selectedCategory = expense; 
        }
            this.selectedCategoryInfo(expense);
        }


       status() { //recurring status 
            if (this.recurringStatus === 'YES') {
                this.recurring = true;
                this.recurringduration = ['Monthly', '3-Months', '6-Months', '12-Months'];
            } else {
                this.recurring = false;
            }
        }

        // recuuringstatus() { //recurring status 
        //     var _this = this;
        //     if (this.recuuring == true) {
        //         this.recurringrow = true; 
        //         this.recurringduration = ['Monthly', '3-Months', '6-Months', '12-Months'];
        //     } 
        //      else if(this.recuuring == false){
        //          this.recurringrow = false;
        //     }
        //     else if(this.norecuuring == false || this.norecuuring == true){
        //          this.recurringrow = false;
        //     }
        // }
             

        getExpenses() { //view in the table
            var _this = this;
            this.$http.get('/api/expenses/gettingexpensesInfo')
                .success(function(data) {
                     _this.newExensesShow =[];
                    for (var i=0;i<data.length;i++){
                        _this.newExensesShow.push(data[i]);
                    }
                    console.log(_this.newExensesShow);
                })
                .error(function(data) {
                    _this.toastr.error("Something Went Wrong");
                });
        }

        // scroll(){
        //     var _this = this;
        //     var last = this.newExensesShow.length;
        //     for(var j=0;j<1;j++){
        //     this.newExensesShow.push(_this.expensesShow[last+j]);
        //     }
        //     if(_this.newExensesShow.length == _this.expensesShow.length)
        //     {
        //         _this.toastr.success('No More Expenses to Load');
        //     }  
        // }

        pendingExpenses() {
            var _this = this;
            _this.expensesPendingArray = [];
            _this.totalExpAmoArray=[];
            this.$http.get('/api/expenses/pendingExpense')
            .success(function(data)
            {
                _this.expensesPendingArray = data; 
            }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
        } 

        
        exist(expenses) {
            var _this = this;
          return  _this.totalExpAmoArray.indexOf(expenses) > -1;
        }

    paymentSelected(expenses) {
        var _this = this;
        var idx =  _this.totalExpAmoArray.indexOf(expenses);
        if(idx > -1){
            _this.totalExpAmoArray.splice(expenses,1)
        }
        else{
            _this.totalExpAmoArray.push(expenses)
        }                                                        
    }

        clickAll() {
            var _this = this;
            if(this.selectedAll == true){
                angular.forEach(_this.expensesPendingArray,function(expenses)
                {
                    var idx = _this.totalExpAmoArray.indexOf(expenses)
                    if(idx == 0){
                        return true;
                    }
                    else{
                        _this.totalExpAmoArray.push(expenses)
                    }
                })
            }
            else{
                _this.totalExpAmoArray = [];

                // this.warning = ;
            }


        }


        payExpenses() {     //payexpenses final stage
            var _this = this; 
            _this.totalExpAmount = 0; 
            for(var i=0;i< _this.totalExpAmoArray.length;i++){
                _this.amount =  _this.totalExpAmoArray[i].expenseAmount;
                _this.totalExpAmount = _this.totalExpAmount + _this.amount; 
            }
            // if(_this.totalExpAmoArray.length == 0){
            //     _this.toastr.success('Please Select atleast One Expense to Pay');
            // }          

        }

        selectedCategoryInfo(expense) { //getting the category info
            var _this = this;
            var expenseId;
            this.expenseSelected = expense;
            this.$http.post('/api/expenses/expensetypeInfo', {
                category: this.expenseSelected
            }).success(function(data) { 
                _this.expenseTypeId = data[0].expenseTypeId;
                expenseId =  _this.expenseTypeId;
                _this.getRespExpenses(expenseId);//to populate respective expenses in the table
            }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
        }

        getRespExpenses(expenseId) {  //to populate respective expenses in the table
          var _this = this;
          this.respExpensesArray =[];
          _this.getRespExpensesArray = [];
          this.expenseId = expenseId; 
          this.$http.post('/api/expenses/getRespExpenses',{
            expenseId:this.expenseId
          }).success(function(data)
          {
               for(var m=0;m<data.length;m++){
                    _this.respExpensesArray.push(data[m]);
               }
          }).error(function(data) { 
                    _this.toastr.error("Sorry! Something Went Wrong");
                });
        }

        // respScroll(){
        //     var _this = this;
        //     var last = _this.respExpensesArray.length;
        //     for (var n=0;n<1;n++){
        //         this.respExpensesArray.push(_this.getRespExpensesArray[last+n]);
        //     }
        //     if(_this.respExpensesArray.length == _this.getRespExpensesArray.length ){
        //         _this.toastr.success('No More Expenses to Load');
        //     }
        // }


        expenseSave() { //saved the expense
            var _this = this;
            var date = new Date(this.Date);
            date.setDate(date.getDate() +1)
            if (this.comment === null) {
                this.comment = null;
            } else {
                this.comments = this.comment;
            }
            if ( (this.selectedCategory == null || undefined )|| (this.amount == null || undefined) || (this.Date == null || undefined ) || (this.expensesStatus == null || undefined)){
                _this.toastr.error('Fill All The Fields!', 'Failed');
                return;
                
            } else{
                var name=this.expensesName.charAt(0).toUpperCase() + this.expensesName.slice(1);
                console.log(name);
                this.$http.post('/api/expenses/expenseSaved', {
                name: name,
                categoryId: _this.expenseTypeId,
                expenseAmount: this.amount,
                date: date,
                status: this.expensesStatus,
                comments: this.comment
            }).success(function(data) { 
                _this.createExpense = data;
                _this.toastr.success('Expenses Added SuccessFully!', 'Success');
                _this.getRespExpensesArray.push(_this.createExpense); 
                _this.getRespExpenses(data.expenseTypeId);
                _this.expensesName = null,
                    _this.amount = null,
                    _this.Date = null,
                    _this.recurringStatus = null,
                    _this.recurringDuration = null,
                    _this.recurringDate = null,
                    _this.expensesStatus = null,
                    _this.comment = null
            }).error(function(data) {
                _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
            });
        }

        }



    }
    angular.module('guwhaApp')
        .component('expenses', {
            templateUrl: 'app/dashboard/expenses/expenses.html',
            controller: ExpensesComponent
        });

})();