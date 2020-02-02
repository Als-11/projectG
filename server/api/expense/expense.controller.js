/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/expenses              ->  index
 * POST    /api/expenses              ->  create
 * GET     /api/expenses/:id          ->  show
 * PUT     /api/expenses/:id          ->  update
 * DELETE  /api/expenses/:id          ->  destroy
 */

 'use strict';

 import _ from 'lodash';
 import Expense from './expense.model';
 import User from '../user/user.model';
 import ExpenseType  from '../../models/ExpenseType.model';
 import jwt from 'jsonwebtoken';
 import crypto from 'crypto';
 import biguint from 'biguint-format';

 function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
    .then(updated => {
      return updated;
    });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
      .then(() => {
        res.status(204).end();
      });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}


export function expensesDetailsMonthly(req, res) {  //user expenses
  var use = jwt.decode(req.cookies.token);
  var fromDate = new Date(req.body.fromDate)
  var endDate = new Date(req.body.toDate)
  return Expense.aggregate([ 
  {
   "$match":{ "userId":use.userId,"expenseDate":{$gte:fromDate},
   "expenseDate":{$lte:endDate}}

 },
 {
   "$lookup": {
    from: "expensetypes",
    localField: "expenseTypeId",
    foreignField: "expenseTypeId",
    as: "Respectiveinfo"
  }
},

{
  "$group" : {
   _id : { expenseTypeId: "$expenseTypeId" ,Respectiveinfo:"$Respectiveinfo"},
   totalAmount: { 
    $sum: "$expenseAmount" 
  } 
}}   
]).exec()
  .then(respondWithResult(res))
  .catch(handleError(res));
}

export function random (qty) {
  return crypto.randomBytes(qty);
}

export function getShaKey(req,res){
 var use = jwt.decode(req.cookies.token); 
   // var txnid = shortid.generate();
   var min = 10000;
   var max = 99999;
   var txnid = Math.floor(Math.random() * (max - min + 1)) + min;
   // var txnid = biguint.format(random(8), 'dec');
   var productinfo= " ";
   for(var i=0;i<req.body.totalpaymentsselected.length;i++){
    var productinfo = productinfo+","+req.body.totalpaymentsselected[i].expenseName;
    Expense.update({expenseId:req.body.totalpaymentsselected[i].expenseId},
      {"$set":{transId:txnid}
    }).then(function(data)
    {
      console.log(data);
    }) 
  }
  User.findOne({userId:use.userId})
  .then(function(data)
  {
   var  KEY = "rjQUPktU";
   var productinfo = "expenses"
   var SALT = "e5iIg1jwi8";
   var shasum = crypto.createHash('sha512');
   var dataSequence = KEY + '|' + txnid + '|' + req.body.amount + '|' + productinfo + '|' + data.firstName + '|' + data.email + '|||||||||||' + SALT;
   var  resultKey = shasum.update(dataSequence).digest('hex');
   console.log(resultKey);
   console.log(dataSequence);
   var desiredResult = {};
   res.end(JSON.stringify({"shaKey":resultKey+'-'+txnid+'-'+productinfo+'-'+KEY+'-'+req.body.amount
    +'-'+data.firstName+'-'+data.email+'-'+data.phoneNumber})); 
        // payUMoneyRequest(txnid,KEY,req.body.amount,productinfo,data.firstName,data.email,data.phoneNumber,
        //                   resultKey,req.body.surl,req.body.furl,req.body.service_provider);
      })

}

export function successPayumoney(req,res){
  console.log(req.body);
  Expense.find({transId:req.body.txnid})
  .then(function(data)
  {
   console.log(data.length)
   for(var i=0;i<data.length;i++){
    Expense.update({transId:data[0].transId},
      {"$set":{payuId:req.body.mihpayid}},
       {multi: true}
    ).then(function(data)
    {
     
     console.log(data);
   })
  } 
  res.redirect('/dashboard/payment');
})


}

export function getPayuIdPayments(req,res){
  console.log(req.body);
  return Expense.find({
    "expenseId":{"$exists":true},"payuId":{"$exists":true},"anTransID":{"$exists":false},"status":"Pending"})
    .then(respondWithResult(res))
  .catch(handleError(res));
 }

 
 export function processPayment(req,res){
  console.log(req.body);
  return Expense.findOne({expenseId:req.body.expenseId})
    .then(respondWithResult(res))
  .catch(handleError(res));
 }


 export function payPayment(req,res){
  console.log(req.body);
  return Expense.update({expenseId:req.body.expenseId},{"$set":{paymentSource:req.body.paymentSource,status:req.body.status,
         anTransID:req.body.antransId}})
    .then(respondWithResult(res))
  .catch(handleError(res));
 }

export function getPaidPayments(req,res){
 var use = jwt.decode(req.cookies.token);
 var date = new Date();
 date.setHours(0,0,0,0)
  var month = date.getMonth()-1; ///setting last month to up to date
  var setdate = new Date();
  if(month == 0){
   setdate.setMonth(11);
 }
 else{
  setdate.setMonth(month);
}
setdate.setDate(1);
setdate.setHours(0,0,0,0);
console.log(setdate);
console.log(date);
if(use.role =='RESIDENT'){
  return Expense.aggregate([
    {"$match":{"$or":[{"userId":use.userId,"expenseId":{"$exists":true},"payuId":{"$exists":true},"status":"Pending","expenseDate":{$gt:setdate},"expenseDate":{$lte:date}},
    {"userId":use.userId, "paymentId":{"$exists":true},"payuId":{"$exists":true},"status":"Pending","expenseDate":{$gt:setdate},"expenseDate":{$lte:date}}
    ]}}
    ]).then(respondWithResult(res))
  .catch(handleError(res));
}
else{
  return Expense.aggregate([
    {"$match":{"$or":[{"communityId":use.communityId,"userId":null,"payuId":{"$exists":true},"expenseId":{"$exists":true},"status":"Pending","expenseDate":{$gt:setdate},"expenseDate":{$lte:date}},
    {"communityId":use.communityId,"payuId":{"$exists":true},"paymentId":{"$exists":true},"status":"Pending","expenseDate":{$gt:setdate},"expenseDate":{$lte:date}}
    ]}}
    ]).then(respondWithResult(res))
  .catch(handleError(res));
}

}

 // export function payUMoneyRequest(a,b,c,d,e,f,g,h,i,j,k){
 //  console.log("hi");
 //  var requestify = require('requestify'); 
 //  requestify.request('https://test.payu.in/_payment', {
 //     method: 'POST',
 //      body: {
 //       txnid:a,
 //       key:b,
 //       amount:c,
 //       productinfo:d,
 //       firstname:e,
 //       email:f,
 //       phone:g,
 //       hash:h,
 //       surl:i,
 //       furl:j,
 //       service_provider:k
 //     }
 //    })
 //    .then(function(response,err) {
 //        // Get the response body
 //        if(res){
 //       var s =  response.getBody();
 //       console.log(s)}
 //        else{
 //          console.log(err)
 //        }
 //    });
 // }

// export function goPayment(req,res){
//  var querystring = require('querystring'); 
// var http = require('https'); 
// console.log(req.body.hashKey);
// var data = querystring.stringify({ 
//   sourceReferenceId:"testjaprefunda646475767",
//      merchantKey:"rjQUPktU", 
//     merchantTransactionId:"123456",
//      SALT :"e5iIg1jwi8",
//     // key:"T8XybBze", 
//     // merchantTransactionIds:"5782613",
//     totalAmount:"1000",
//     customerName:"CUSTOMER2",
//     customerEmail:"ABC@XYZ.COM",
//     customerPhone:"0123456789",
//     productInfo:"SOMEPRODUCT",
//    paymentDate:"31-07-2014",
//    paymentMode:"COD",
//    paymentStatus:"Success",
//    surl:"www.google.com",
//   furl:"www.appqube.in"
//      // productinfo:"pending",
//      // paymentMode:'COD',
//      // hash:req.body.hashKey,
//      // firstname:"sai",
//      // email:"rvsairam239@gmail.com",
//      // phone:"8125434557",
//      // surl:"www.google.com",
//      // furl:"www.appqube.in",
//      // service_provider:"payu_paisa"

// }); 
// var options = { 
//     // hostname: 'www.payumoney.com', 
//     // port: 443, 
//     path: 'https://test.payu.in/_payment/_payment'+data, 
//     method: 'POST', 
//     headers: { 
//         'Content-Type': 'application/json', 
//         'Content-Length': Buffer.byteLength(data), 
//         'content': data, 
// 'accept': '*/*', 
//        'Authorization' : 'HESOg9TYwzqK5q5Fndj5DpS5T2h9SxMYezrL3yR7ma4='
//     } 
// }; 

// var req = http.request(options, function(res) { 
//     res.setEncoding('utf8'); 
//     res.on('data', function(chunk) {    // data will be available in callback 
//         console.log("body: " + chunk); 
//     });
//     // res.end(data); 
// }); 
// req.on('error',function(e){ 
//   console.log("nnjkghfdkgkdfgkjbfdg");
//   console.log('Error'+ e.message); 
// }); 
// req.write(data); 
// // req.end();
// req.end(data);

// }
export function groupMonthlyExpenses(req, res) {  //user expenses(group by monthly)
  var use = jwt.decode(req.cookies.token);
  var x = new Date();
  x.setDate(1);
  x.setMonth(0);
  var fromDate = new Date(x); 
  x.setDate(31);
  x.setMonth(11);
  var endDate = new Date(x);
  if(use.role == "COMMUNITY_ADMIN"){
    var userId = use.communityId;
    return Expense.aggregate([ 
    {
      "$match":{"$and":[{"communityId":userId,"expenseDate":{$lte:endDate}},
      {"communityId":userId,"expenseDate":{$gte:fromDate}},
      ]}    
    },

    { "$project": {
      "expenseAmount": 1, 
      "month": { "$month": "$expenseDate" }
    }}, 
    { "$group": {
      "_id":  { "month": "$month"}, 
      "total": { "$sum": "$expenseAmount" },
    }},
    {"$sort":{"_id.month":1}}
    ])
    .then(respondWithResult(res))
    .catch(handleError(res));
  }
  else{
    var userId = use.userId;
    return Expense.aggregate([ 
    {
      "$match":{"$and":[{"userId":userId,"expenseDate":{$lte:endDate}},
      {"userId":userId,"expenseDate":{$gte:fromDate}},
      ]}    
    },

    { "$project": {
      "expenseAmount": 1, 
      "month": { "$month": "$expenseDate" }
    }}, 
    { "$group": {
      "_id":  { "month": "$month"}, 
      "total": { "$sum": "$expenseAmount" },
    }},
    {"$sort":{"_id.month":1}}
    ])
    .then(respondWithResult(res))
    .catch(handleError(res))
  } 

}

export function sixMonthsExpense(req, res) {  //user expenses(group by 6-monthly or 3 months)
  var use = jwt.decode(req.cookies.token);
  var date = new Date();
  var from= date.setMonth(date.getMonth() - req.body.months);
  var fromDate = new Date(from);
  var endDate = new Date();
  if(use.role == "COMMUNITY_ADMIN"){
    var userId = use.communityId;
    return Expense.aggregate([ 
    {
      "$match":{"$and":[{"communityId":userId,"expenseDate":{$lte:endDate}},
      {"communityId":userId,"expenseDate":{$gte:fromDate}},
      ]}    
    },

    { "$project": {
      "expenseAmount": 1, 
      "month": { "$month": "$expenseDate" }
    }}, 
    { "$group": {
      "_id":  { "month": "$month"}, 
      "total": { "$sum": "$expenseAmount" },
    }},
    {"$sort":{"_id.month":-1}}
    ])
    .then(respondWithResult(res))
    .catch(handleError(res));
  }
  else{
    var userId = use.userId;
    return Expense.aggregate([ 
    {
      "$match":{"$and":[{"userId":userId,"expenseDate":{$lte:endDate}},
      {"userId":userId,"expenseDate":{$gte:fromDate}},
      ]}    
    },

    { "$project": {
      "expenseAmount": 1, 
      "month": { "$month": "$expenseDate" }
    }}, 
    { "$group": {
      "_id":  { "month": "$month"}, 
      "total": { "$sum": "$expenseAmount" },
    }},
    {"$sort":{"_id.month":-1}}
    ])
    .then(respondWithResult(res))
    .catch(handleError(res));
  }

  
  
}

export function yearly(req, res) {  //user expenses(group by yearly)
  var use = jwt.decode(req.cookies.token);
  if(use.role =='RESIDENT'){
    return Expense.aggregate([ 
     {"$match":{"userId":use.userId}},
     { "$project": {
      "expenseAmount": 1, 
      "year": { "$year": "$expenseDate" }
    }}, 
    { "$group": {
      "_id":  { "year": "$year"}, 
      "total": { "$sum": "$expenseAmount" },
    }},
    {"$sort":{"_id.year":1}}
    ])
    .then(respondWithResult(res))
    .catch(handleError(res));

  }
  else{
   return Expense.aggregate([ 
     {"$match":{"communityId":use.communityId}},
     { "$project": {
      "expenseAmount": 1, 
      "year": { "$year": "$expenseDate" }
    }}, 
    { "$group": {
      "_id":  { "year": "$year"}, 
      "total": { "$sum": "$expenseAmount" },
    }},
    {"$sort":{"_id.year":1}}
    ])
   .then(respondWithResult(res))
   .catch(handleError(res));
 }
}

export function communityExpenses(req, res) {  //community expenses
  var use = jwt.decode(req.cookies.token);
  var fromDate = new Date(req.body.fromDate);
  var endDate = new Date(req.body.toDate); 
  return Expense.aggregate([ 
  {
   "$match":{ "communityId":use.communityId,"expenseDate":{$gte:fromDate},
   "expenseDate":{$lte:endDate}}

 },

 {
   "$lookup": {
    from: "expensetypes",
    localField: "expenseTypeId",
    foreignField: "expenseTypeId",
    as: "Respectiveinfo"
  }
},

{
  "$group" : {
   _id : { expenseTypeId: "$expenseTypeId" ,Respectiveinfo:"$Respectiveinfo"},
   totalAmount: { 
    $sum: "$expenseAmount" 
  } 
}}   
]).exec()
  .then(respondWithResult(res))
  .catch(handleError(res));
}

export function getuserPayments(req, res) {
  var use = jwt.decode(req.cookies.token); 
  var date = new Date();
  date.setHours(0,0,0,0)
  var month = date.getMonth()-1; ///setting last month to up to date
  var setdate = new Date();
  if(month == 0){
   setdate.setMonth(11);
 }
 else{
  setdate.setMonth(month);
}
setdate.setDate(1);
setdate.setHours(0,0,0,0);
console.log(setdate);
console.log(date);
if(use.role =='RESIDENT'){
  return Expense.aggregate([
    {"$match":{"$or":[{"userId":use.userId,"expenseId":{"$exists":true},"payuId":{"$exists":false},"status":"Pending","expenseDate":{$gt:setdate},"expenseDate":{$lte:date}},
    {"userId":use.userId, "paymentId":{"$exists":true},"payuId":{"$exists":false},"status":"Pending","expenseDate":{$gt:setdate},"expenseDate":{$lte:date}}
    ]}}
    ]).then(respondWithResult(res))
  .catch(handleError(res));
}
else{
  return Expense.aggregate([
    {"$match":{"$or":[{"communityId":use.communityId,"userId":null,"payuId":{"$exists":false},"expenseId":{"$exists":true},"status":"Pending","expenseDate":{$gt:setdate},"expenseDate":{$lte:date}},
    {"communityId":use.communityId,"payuId":{"$exists":false},"paymentId":{"$exists":true},"status":"Pending","expenseDate":{$gt:setdate},"expenseDate":{$lte:date}}
    ]}}
    ]).then(respondWithResult(res))
  .catch(handleError(res));
}
}




// views in a table(all expenses) 
export function gettingexpensesInfo(req, res) {
  var use = jwt.decode(req.cookies.token); 
  if(use.role === 'COMMUNITY_ADMIN')
  {
   return Expense.find({communityId:use.communityId,userId:null}).sort({expenseId:-1}).exec()
   .then(respondWithResult(res))
   .catch(handleError(res));
 }
 else{
  return Expense.find({userId:use.userId}).sort({expenseId: -1}).exec()
  .then(respondWithResult(res))
  .catch(handleError(res));
}

}

// Gets a expensetypeId 
export function expensetypeInfo(req, res) {
  return ExpenseType.find({category:req.body.category}).exec()
  .then(respondWithResult(res))
  .catch(handleError(res));
}


export function expenseSaved(req, res) {
  var use = jwt.decode(req.cookies.token);
  if(use.role ==='COMMUNITY_ADMIN'){
   var communityId = use.communityId;
   return Expense.create({
    expenseName:req.body.name,
    userId:null,
    expenseAmount:req.body.expenseAmount,
                              communityId:communityId,  //communityExpense(communityId)
                              expenseTypeId:req.body.categoryId,
                              expenseDate:req.body.date,
                              status:req.body.status,
                              comments:req.body.comments
                            }).then(respondWithResult(res,201))
   .catch(handleError(res));
 }

 else {
   var userId = use.userId;
   return Expense.create({
    expenseName:req.body.name,
    userId:userId,
    expenseAmount:req.body.expenseAmount,
                              userId:userId,   //user expense(userId)
                              expenseTypeId:req.body.categoryId,
                              expenseDate:req.body.date,
                              status:req.body.status,
                              comments:req.body.comments
                            }).then(respondWithResult(res,201))
   .catch(handleError(res));  
 }

}

export function pendingExpense(req, res) {    //to show in modal
  var use = jwt.decode(req.cookies.token);
  var userId = use.userId;
  var communityId = use.communityId;
  if(use.role === 'COMMUNITY_ADMIN'){
    return Expense.find({status:"Pending",communityId:communityId,userId:null }).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
  }
  else{
   return Expense.find({status:"Pending",userId:userId }).exec()
   .then(handleEntityNotFound(res))
   .then(respondWithResult(res))
   .catch(handleError(res)); 
 }
 
}

// Gets a list of respective Expenses
export function getRespExpenses(req, res) {
 var use = jwt.decode(req.cookies.token);
 if(use.role === 'COMMUNITY_ADMIN'){
  return Expense.find({expenseTypeId:req.body.expenseId,communityId:use.communityId })
  .then(respondWithResult(res))
  .catch(handleError(res));
}
else{
 return Expense.find({expenseTypeId:req.body.expenseId,userId:use.userId })
 .then(respondWithResult(res))
 .catch(handleError(res));
}
}

// Gets a single Expense from the DB
export function show(req, res) {
  return Expense.findById(req.params.id).exec()
  .then(handleEntityNotFound(res))
  .then(respondWithResult(res))
  .catch(handleError(res));
}

// Creates a new Expense in the DB
export function create(req, res) {
  return Expense.create(req.body)
  .then(respondWithResult(res, 201))
  .catch(handleError(res));
}

// Updates an existing Expense in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Expense.findById(req.params.id).exec()
  .then(handleEntityNotFound(res))
  .then(saveUpdates(req.body))
  .then(respondWithResult(res))
  .catch(handleError(res));
}

// Deletes a Expense from the DB
export function destroy(req, res) {
  return Expense.findById(req.params.id).exec()
  .then(handleEntityNotFound(res))
  .then(removeEntity(res))
  .catch(handleError(res));
}
