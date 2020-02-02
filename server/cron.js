'use strict';

import path from 'path';
import Paymentsrequests from './api/paymentsrequests/paymentsrequests.model';
import Community from './api/community/community.model';
import EMPLOYEE from './api/employee/employee.model';
import User from './api/user/user.model';
import Expense from './api/expense/expense.model';
export function cron() {
    var cron = require('node-schedule');
    var async = require('async')
    var maintenanceJob = cron.scheduleJob('0 0 12 1 1/1 ? *', function() { //on every month 1st 
                Community.find({}) 
                  //fetch all communities
                    .then(function(data) {
                        async.forEach(data, function(data) {
                            User.find({ communityId: data.communityId, role: "RESIDENT" })
                             //from each community,fetch all users data
                                .then(function(response) {
                                    async.forEach(response, function(response) {
                                        Floor.find({ floorId: response.floorId })
                                        //fetch maintence cost and date fro each flat
                                            .then(function(res) {
                                                var date = res.maintenanceDate
                                                var maintenancedate = new Date().setDate(date)
                                                async.forEach(res, function(res) {
                                                  //payments and expenses raised
                                                    Paymentsrequests.create({
                                                        communityId: data.communityId,
                                                        communityName: data.communityName,
                                                        customerId: response.userId, //userexpenses so save  with userid
                                                        paymentAmount: res.maintenanceCost,
                                                        raisedOn: new Date(),
                                                        paymentLastDate: maintenancedate,
                                                        paymentType: 'MAINTENANCE',
                                                        raisedBy: data.communityId,
                                                        isPaid: false
                                                    })
                                                    Expense.create({
                                                        expenseName: 'MAINTENANCE',
                                                        userId: response.userId,
                                                        expenseAmount: data.maintenanceCost,
                                                        communityId: data.communityId, //communityExpense(communityId)
                                                        paymentId: data.paymentId,
                                                        expenseDate: new Date(),
                                                        status: "Pending"
                                                    })
                                                })

                                                })

                                            });
                                    });
                                });
                        });
                    });




                var salaryjob = cron.scheduleJob('0 0 12 1 1/1 ? *', function() { //on every month 1st 
                    Community.find({})
                        .then(function(data) {
                            async.forEach(data, function(data) {

                                EMPLOYEE.find({ communityId: data.communityId })
                                    .then(function(response) {
                                        async.forEach(response, function(response) {
                                            Paymentsrequests.create({
                                                communityId: data.communityId,
                                                communityName: data.communityName,
                                                customerId: data.communityId, //communityexpenses so save  with communityId
                                                paymentAmount: response.salary, //EMPLOYEE SALARY 
                                                raisedOn: new Date(),
                                                paymentLastDate: response.salaryDate, //EMPLOYEE SALARY-DATE
                                                paymentType: 'SALARIES',
                                                raisedBy: data.communityId,
                                                isPaid: false
                                            })
                                            Expense.create({
                                                expenseName: 'SALARIES',
                                                userId: null,
                                                expenseAmount: data.maintenanceCost,
                                                communityId: data.communityId, //communityExpense(communityId)
                                                paymentId: data.paymentId,
                                                expenseDate: new Date(),
                                                status: "Pending"
                                            })
                                        });

                                    });
                            });
                        });
                });

            
}