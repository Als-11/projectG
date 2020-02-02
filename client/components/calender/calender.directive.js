'use strict';

var app = angular.module("guwhaApp");

  app.controller("calendarDemo", function($scope,$rootScope) {
      $scope.day = moment();
       // var s = $scope.day._d;
       //    var t = s.getMonth()+":"+s.getFullYear();
       //      $rootScope.sai = t;
       //       
  });

app.directive("calendar", function($http,toastr,$rootScope) {
    return {
        restrict: "E",
        templateUrl: "components/calender/calender.html",
        controller:"calendarDemo",
        scope: {
            selected: "="
        },
        link: function(scope) {
            scope.selected = _removeTime(scope.selected || moment());
            scope.month = scope.selected.clone();
            var start = scope.selected.clone();
            scope.timeIntervalArray = ['7Days','15Days','Monthly','Custom'];
            start.date(1);
            _removeTime(start.day(0));
            _buildMonth(scope, start, scope.month); 

            scope.select = function(day) {
                scope.selected = day.date; 
            };

        scope.dayServices = function(day){
           var day = day.date._d
           $rootScope.selectedDay = day;
           scope.currentDate = day;
           var weeknumber = day.getDay();
           var weekNmaes = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','saturday'];
           scope.weekName = weekNmaes[weeknumber]
           $http.post('/api/serviceRequests/selectDayService',{
                            day:day
                    }).success(function(data)
                    { 
                         
                          scope.dayservicesArray = [];
                          scope.dayservicesArray = data;
                    })

            }

            scope.TimeInterval = function(timeIntervalSelcted){ 
              scope.selctedInterval = timeIntervalSelcted ;
              if(timeIntervalSelcted =='7Days' || timeIntervalSelcted =='15Days' || timeIntervalSelcted=='Monthly'){
                 scope.selctedInterval = false;
              }
              else{
                 scope.selctedInterval = true;
              }
            }

          scope.fillEnDate = function(fromdate,timeIntervalSelcted){
            if(timeIntervalSelcted == '7Days'){
              var noOfDays = 7
            }
            else if(timeIntervalSelcted == '15Days'){
               var noOfDays  = 15
            }
            else if(timeIntervalSelcted == 'Monthly'){
              var noOfDays  = 30
            }
            var startDate = fromdate;
          startDate = new Date(startDate.replace(/ /g, "/"));
         var  noOfDaysToAdd  = noOfDays, count = 0;
          while(count < noOfDaysToAdd){
              var endDate = new Date(startDate.setDate(startDate.getDate()+1));
                 count++;
          }
          scope.endautofilldate = endDate;
        }

          scope.deleteServices = function(timeIntervalSelcted,fromdate,enddate,endautofilldate){
             if(enddate == undefined){
              var endServicesDate = endautofilldate;
              enddate = '';
             }
             else{
              var endServicesDate = enddate;
               endautofilldate = '';
             }
             $http.post('/api/serviceRequests/deleteServices',{
                  fromdate:fromdate,
                  enddate:endServicesDate,
             }).success(function(data)
             {
                   var month = scope.month._d.getMonth()+1; 
                      var year = scope.month._d.getFullYear();
                      selectedService(month,year)  
             })
          }
             scope.update = function(x) {
                   $http.post('/api/serviceRequests/updateService',{
                      serviceRequestId:x.servRequestId,
                      units:x.units
                   }).success(function(data)
                   {
                    toastr.success('Your Succesfully Updated the service');
                      var month = scope.month._d.getMonth()+1;
                      var year = scope.month._d.getFullYear();
                      selectedService(month,year)
                      
                   })
            }
            
            
            scope.delete = function(x) {
                 $http.post('/api/serviceRequests/deleteService',{
                      serviceRequestId:x.servRequestId
                   }).success(function(data)
                   {
                      toastr.warning('Deleted! your Service');
                       var month = scope.month._d.getMonth()+1;
                      var year = scope.month._d.getFullYear();
                      selectedService(month,year)
                      
                   })
            }

                scope.services = function() {   //getting the services Names and providers count
                    $http.get('/api/services/getServices')
                    .success(function(data)
                    {
                       console.log(data);
                          scope.servicesNames = [];
                           for (var i = 0; i < data.length; i++) {
                         scope.servicesNames.push(data[i].serviceCategory);
                       }
                    })
                   }

                   scope.serviceproviderDetails = function(user){
                       var serviceid = user;
                       scope.selSerproId = user
                       $rootScope.serId = serviceid;
                        scope.serviceApprovalsCard = true
                      $http.post('/api/serviceProviderDetails/serviceproviderDetail',{
                            serviceId: serviceid
                        }).success(function(data)
                        {  
                             var serviceProviderArray = [];
                            scope.serviceProviderArray = data;  
                             
                        })
                    }

                   scope.getTypeServices = function(serviceApprovals) {   //getting the services types based on the service Category
                      var serviceProviderid = serviceApprovals._id.serviceProviderId;
                      $rootScope.servProId = serviceProviderid;
                       scope.serviceRegistrationForm = true;
                      $http.post('/api/serviceProviderDetails/getSelectedBrands',{
                        serviceProviderId:serviceProviderid,
                        serviceCategory:$rootScope.serId 
                      }).success(function(data)
                      {
                            scope.serviceTypArray = [];
                            for(var i=0;i<data.length;i++){
                          var brandName =  data[i]._id.ToTalBrands[0].brandName;
                            var quantity  = data[i]._id.ToTalBrands[0].quantity;
                              var service = brandName+','+quantity;
                             scope.serviceTypArray.push(service)
                           }
                           console.log(scope.serviceTypArray)
                      })
                 }
                  scope.typeSerInfo = function(typeService)//getting user selected serviceType info
                           {
                            var selectedService = typeService.split(',');
                              $http.post('/api/typesForServices/userSelSertype',{
                              name:selectedService[0],
                              quantity:selectedService[1],
                              serviceProviderId:$rootScope.servProId,
                              serviceId: $rootScope.serId,
                            }).success(function(data)
                            {
                                  
                                 scope.unitPrice = data[0].unitPrice;
                                   $rootScope.typeId = data[0].typeId;
                            })
                           }

                  scope.getTotalCost = function(quantity,UnitPrice) //get the cost based on the quantity
            {
                 scope.totalCost = quantity * UnitPrice;
            }

            scope.userSaveService = function(typeService,quantity,totalCost){
              $http.post('/api/serviceRequests/additonalService',{
                 servicecategory: $rootScope.serId,
                serviceProviderId: $rootScope.servProId,
                units:quantity,
                totalCost:totalCost,
                deliveryDate:$rootScope.selectedDay,
                customTypeId:$rootScope.typeId,
                 serviceTypeName:typeService
              }).success(function(data)
              {
                 var userSelectedService,userselectedError= '';
                scope.userSelectedService = true;
                scope.userselectedError = false;
                var month = scope.month._d.getMonth()+1;
                var year = scope.month._d.getFullYear();
              selectedService(month,year)   
              }).error(function(data)
              {
                var userSelectedService,userselectedError = '';
                 scope.userSelectedService = false;
                scope.userselectedError = true 
              })  

            }

            scope.next = function() {
                var next = scope.month.clone();
                _removeTime(next.month(next.month()+1)).date(1);
                scope.month.month(scope.month.month()+1);
                _buildMonth(scope, next, scope.month);
            };

            scope.previous = function() {
                var previous = scope.month.clone();
                _removeTime(previous.month(previous.month()-1).date(1));
                scope.month.month(scope.month.month()-1);
                _buildMonth(scope, previous, scope.month);
            };
        }
    };

function selectedService(x,y) {
    var _this = this;
    var month = x;
    var year = y; 
  $http.post('/api/serviceRequests/dayByDayServices',{
    month:  month,
    year: year
  }).success(function(data)
  {
       for(var i=0;i<data.length;i++){
       var date = new Date(data[i].services[0].deliveryDate);
          var resultArray = [];
            for(var j=0;j<data[i].services.length;j++)
            {
                var title = data[i].services[j].serviceTypeName+' ('+data[i].services[j].units + ")";
                    resultArray.push(title);
            }
            var resultServices = "";
            for(var k=0;k<resultArray.length;k++){
             var resultServices=resultServices+ "<li>" +  resultArray[k] + "</li>"
            //var.resultServices=var.resultServices+var.resultArray[k]+"<br>";
          }
          //   
          // var sai = {};
          //  var.resultArray.forEach(function(data)
          //  {
          //     sai[data[0]] = data[1];
          //  })
          //  var result = sai.toString();

           var requiredDate = date.getMonth()+1+":"+date.getDate()+":"+date.getFullYear();
           var id =    requiredDate
           var result = document.getElementById( id);
            result.innerHTML = "<ul>" +  resultServices + "</ul>";
       }
     
     
  })
               // this.events = [
        // {title: 'All Day Event',start: new Date(y, m, 1)},
        // {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
        // {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
        // {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
        // {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
        // {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    // ];
     

        }
    
    function _removeTime(date) {
        return date.day(0).hour(0).minute(0).second(0).millisecond(0);
    }

    function _buildMonth(scope, start, month) {
        scope.weeks = [];
        var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
        while (!done) {
            scope.weeks.push({ days: _buildWeek(date.clone(), month) });
            date.add(1, "w");
            done = count++ > 2 && monthIndex !== date.month();
            monthIndex = date.month();
            var monthNumber = date.month()+1;
            var yearNumber = date.year();
            selectedService(monthNumber,yearNumber);         //getting the month,year
        }
    }

    function _buildWeek(date, month) {
        var days = [];
        for (var i = 0; i < 7; i++) {
            days.push({
                name: date.format("dd").substring(0, 1),
                number: date.date(),
                isCurrentMonth: date.month() === month.month(),
                isToday: date.isSame(new Date(), "day"),
                isday:date.month()+1+":"+date.date()+":"+date.year(),
                date: date
            });
            date = date.clone();
            date.add(1, "d");
        }
         return days;
    }





});
// First, we’re setting up the Angular application

