'use strict';
(function() {

    class OrdersComponent {
        constructor($http, Auth,toastr) {
            this.$http = $http;
            this.toastr = toastr;
            this.Auth = Auth;
            this.hideButton = false;
            this.hideAcceptButton = false;
            this.order();
        }

        order(){
           var _this = this;
            var date = new Date()
             var fromdate = moment(date);
          fromdate.add(1, 'days');
         this.getOrders(fromdate,date);
       }

         getOrders(fromdate,date) {
          var _this = this;
           this.ordersArray = [];
           this.$http.post('/api/serviceRequests/downArrow',{
                  fromDate:fromdate,
                  date:date
           })
           .success(function(data)
           {
            if(data.length == 0){
               _this.orderDate = new Date(fromdate);
                _this.ordersArray = data;
            }
            if(data.length !=0){
               _this.ordersArray = data; 
            _this.orderDate = _this.ordersArray[0]._id.deliveryDate;
            }

            _this.weeknumber = new Date(_this.orderDate).getDay();
            var weekNmaes = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','saturday'];
          _this.weekName = weekNmaes[_this.weeknumber];
           })
           .error(function(data)
           {
             _this.toastr.error("Sorry!Something Went Wrong");
           })
        }

        inProcess(x,y){   //click on inprocess button 
          console.log(x);
           var _this = this;
           var communityId = x._id.communityInfo[0].communityId
           var date = new Date(_this.orderDate);
           this.$http.post('/api/serviceRequests/inProcessingRequest',{
               communityId: x._id.communityInfo[0].communityId,
               date:date,
               status:y
           }).success(function(data)
           {
              if(y ==2){
                _this.hideButton = true;
              }
              if(y ==1){
                _this.hideAcceptButton = true;
                _this.hideButton = false;
                _this.deliverButton = false;
                _this.ordersTable ="ACCECPTED";

              }
                 
           }) .error(function(data)
           {
             _this.toastr.error("Sorry!Something Went Wrong");
           })
      }

      downArrow(){
        var _this = this;
          var binddate = new Date(this.orderDate);  
          var date = moment(binddate);
          date.subtract(2,'days')
          var fromdate = moment(binddate);
          fromdate.subtract(1, 'days');
          
        // var fromdate= moment(date, "DD-MM-YYYY").add('days', 1);

        // var from = date.getDate()+1;
        // var fromdate = new Date();
        //  fromdate.setDate(from);
         // this.getOrders(fromdate,date)
            //  var from = binddate.getDate()-1;
            // var fromdate = new Date();
            // fromdate.setDate(from);  //we are seeting the fromdate -1
            //  var to  = binddate.getDate()-2;
            //  var date = new Date();
            //  date.setDate(to);     //we are setting the date
           this.getOrders(fromdate,date)
      }
       upArrow(){
         var _this = this;
          var date = new Date(this.orderDate);
          var fromdate = moment(date);
          fromdate.add(1, 'days');
          // var todate = moment(date);
          // todate.subtract(1, 'days');
        
        // var fromdate= moment(date, "DD-MM-YYYY").add('days', 1);

        // var from = date.getDate()+1;
        // var fromdate = new Date();
        //  fromdate.setDate(from);
        this.getOrders(fromdate,date)
      }

      goToDate() {
          var date = new Date(this.Date);
           var fromdate = moment(date);
          var todate = moment(date);
          todate.subtract(1, 'days');
          this.getOrders(fromdate,todate)
        
            //  var from = binddate.getDate();
            //  var month = binddate.getMonth();
            // var fromdate = new Date();
            // fromdate.setDate(from);  //we are seeting the fromdate -1
            // fromdate.setMonth(month)
    
            //  var to  = binddate.getDate()-1;
            //  var date = new Date();
            //  date.setDate(to);     //we are setting the date
            //  date.setMonth(month);
    
            //  this.getOrders(fromdate,date)
           }

      getAllOrdersCommunity(x){
        var _this = this;
        _this.getAllorderCommunityArray = [];
        var date = new Date();
        var number = date.getDate();
        this.$http.post('/api/serviceRequests/getAllOrdersCommunity',{
               communityId: x._id.communityInfo[0].communityId,
               date:this.orderDate
            }).success(function(data)
            {
               console.log(data);
              _this.getAllorderCommunityArray = data;
              console.log(_this.getAllorderCommunityArray)
               html2canvas(document.getElementById('OderList'), {
         onrendered: function(canvas) {
           var data = canvas.toDataURL();
           var docDefinition = {
             content: [{
               image: data,
               width: 500,
             }]
           };
           pdfMake.createPdf(docDefinition).download("test.pdf");
         }
       });
            })

      }



    }

    angular.module('guwhaApp')
        .component('orders', {
            templateUrl: 'app/servicesdashboard/orders/orders.html',
            controller: OrdersComponent
        });

})();
