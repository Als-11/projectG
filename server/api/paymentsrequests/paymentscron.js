import Paymentsrequests from './paymentsrequests.model'; 
import Community from '../community/community.model';
import User from '../user/user.model';
var cron = require('node-schedule');
var maintenanceJob = cron.scheduleJob('0 0 1 * *', function(){ 
    Community.find({})
    .then(function(data)
    { 
    	for(var i=0;i<data.length;i++){
    		var maintenanceDate = data[i].maintenanceDate;
    		var maintenanceAmount = data[i].maintenanceCost;
    		var communityId = data[i].communityId;
    		var communityName = data[i].communityName;
             User.find({communityId:communityId,role:"RESIDENT"})
              .then(function(data)
              {
              	 if(!data.length == 0) {
              	  for(var j=0;j<data.length;j++){
                        Paymentsrequests.create({
                           communityId: communityId,
						    communityName: communityName,
						    customerId:data[j].userId,   //userexpenses so save  with userid
						    paymentAmount:maintenanceAmount,       
						    raisedOn: new Date(),
						    paymentLastDate: maintenanceDate,
						    paymentType:'MAINTENANCE',
						    raisedBy:communityId,
						    isPaid: false  
                        })
                    }
              	   }
              })
    	}
    })
});


var salaryjob = cron.scheduleJob('0 0 1 * *', function(){ 
   Community.find({})
    .then(function(data)
    {
    	for(var i=0;i<data.length;i++){
    		var communityId = data[i].communityId;
    		var communityName = data[i].communityName;
             User.find({communityId:communityId,role:"EMPLOYEE"})
              .then(function(data)
              {
              	  for(var j=0;j<data.length;j++){
                        Paymentsrequests.create({
                           communityId: communityId,
						    communityName: communityName,
						    customerId:communityId,   //communityexpenses so save  with communityId
						    paymentAmount:data[j].salary,   //EMPLOYEE SALARY 
						    raisedOn: new Date(),
						    paymentLastDate: data[j].salaryDate,    //EMPLOYEE SALARY-DATE
						    paymentType:'SALARIES',
						    raisedBy:communityId,
						    isPaid: false  
                        })
              	   }
              })
    	}
    })
});
