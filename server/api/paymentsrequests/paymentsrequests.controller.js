/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/paymentsrequets              ->  index
 * POST    /api/paymentsrequets              ->  create
 * GET     /api/paymentsrequets/:id          ->  show
 * PUT     /api/paymentsrequets/:id          ->  upsert
 * PATCH   /api/paymentsrequets/:id          ->  patch
 * DELETE  /api/paymentsrequets/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Paymentsrequests from './paymentsrequests.model';
import jwt from 'jsonwebtoken';
import Community from '../community/community.model';
import User from '../user/user.model';
import Expense from '../expense/expense.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
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

// Gets a list of Paymentsrequestss
export function index(req, res) {
  return Paymentsrequests.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Paymentsrequests from the DB
export function show(req, res) {
  return Paymentsrequests.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a  Paymentsrequests from the DB based on the user& communityadmin
export function getPayment(req, res) {
  var use = jwt.decode(req.cookies.token);    
  if(use.role == "COMMUNITY_ADMIN"){
      var userId = use.communityId;
  }
  else {
    var userId = use.userId;
  } 
  return Paymentsrequests.find({customerId:userId}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function getuserPayments(req, res) {
  var use = jwt.decode(req.cookies.token);   
  if(use.role == "COMMUNITY_ADMIN"){
      var userId = use.communityId;
      return Paymentsrequests.find({customerId:use.userId,userId:null}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
  }
  else {
    var userId = use.userId;
    return Paymentsrequests.find({customerId:use.userId}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
  }
  
}



//gets a paymentsdetais for Serviceprovider view
export function getPayments(req, res) {
  var use = jwt.decode(req.cookies.token);
  return Paymentsrequests.aggregate([
    {"$match":{paymentTo:use.userId,isPaid:false}},   //pending payments
       {"$lookup":{
            from:"communities",
            localField:"communityId",
            foreignField:"communityId",
            as:"resCommunityInfo"
       }},
         { "$group": {
        "_id":  { "communityInfo": "$resCommunityInfo"}, 
        "total": { "$sum": "$paymentAmount" },
      }}
    ]).then(respondWithResult(res, 201))
    .catch(handleError(res));
}

export function payDetailsFrTble(req, res) {      //all payments view
  var use = jwt.decode(req.cookies.token);
  return Paymentsrequests.aggregate([
    {"$match":{paymentTo:use.userId,isPaid:false}},   //pending payments
       {"$lookup":{
            from:"users",
            localField:"customerId",
            foreignField:"userId",
            as:"userInfo"
       }},
       {"$sort":{paymentId:-1}}
    ]).then(respondWithResult(res, 201))
    .catch(handleError(res));

  }

export function  getPaymenDetail(req, res) {      //respective  payments view
  var use = jwt.decode(req.cookies.token);
  return Paymentsrequests.aggregate([
    {"$match":{communityName:req.body.communityName,isPaid:false,communityId:req.body.communityId}},   //pending payments
       {"$lookup":{
            from:"users",
            localField:"customerId",
            foreignField:"userId",
            as:"userInfo"
       }},
       {"$sort":{paymentId:-1}}
    ]).then(respondWithResult(res, 201))
    .catch(handleError(res));

  }


 export function  getadminPayments(req, res){
   var use = jwt.decode(req.cookies.token);
    return Paymentsrequests.find({communityId:use.communityId,paymentTo:null}).exec()
                           .then(respondWithResult(res, 201))
                           .catch(handleError(res));
 }



//Creates a new Paymentsrequests in the DB from serviceprovider
export function createpayrequest(req, res) {
  var use = jwt.decode(req.cookies.token);
  Community.findOne({"communityName":req.body.communityName,"address.address1":req.body.address1,"address.locality":req.body.locality})
  .then(function(data)
  {
     
       Paymentsrequests.create({
    communityId: data.communityId,
    communityName: req.body.communityName,
    paymentTo: use.userId,    //serviceproviderUserId
    customerId: req.body.customerId,
    paymentAmount: req.body.amount,
    raisedOn: new Date(),
    paymentLastDate: req.body.paymentDate,
    paymentType:req.body.paymentType,
    raisedBy:req.body.raisedBy,
    isPaid: false
   })
    .then(function(data){
         return Expense.create({
                              expenseName:req.body.paymentType,
                              userId:req.body.customerId,
                              expenseAmount:req.body.amount,
                              communityId: data.communityId,  //communityExpense(communityId)
                              paymentId:data.paymentId,
                              expenseDate:new Date(),
                             status:"Pending"
                            })
         .then(respondWithResult(res, 201))
         .catch(handleError(res));
     })
  })
    
}


export function maintenanceexpenseSave(req, res) {
    var use = jwt.decode(req.cookies.token);            
    User.find({ communityId: use.communityId, role: "RESIDENT" })
        .then(function(data) { 
            for (var i = 0; i < data.length; i++) { 
                var paymentAmou = (req.body.paymentAmount / data.length)
                   var paymentAmount =  Math.round(paymentAmou * 100) / 100;
                var paymentName = req.body.paymentName;
                var paymentLastDate = req.body.paymentDate;
                Paymentsrequests.create({
                    communityId: use.communityId,
                    customerId: data[i].userId,
                    communityName: req.body.communityName,
                    paymentName: paymentName,
                    paymentTo: use.communityId,  //pay to community
                    paymentAmount: paymentAmount,
                    raisedOn: new Date(),
                    paymentLastDate: paymentLastDate,
                    paymentType: 'MAINTENANCE',
                    raisedBy: req.body.communityName,
                     isPaid: false
                    }).then(function(data)
                    {
                       Expense.create({
                              expenseName:'MAINTENANCE',
                               userId:data.customerId,
                              expenseAmount:paymentAmount,
                              communityId: use.communityId,  //communityExpense(communityId)
                              paymentId:data.paymentId,
                              expenseDate:new Date(),
                             status:"Pending"
                            })
                    })
                }
          }).then(respondWithResult(res))
            .catch(handleError(res));

}

// Upserts the given Paymentsrequests in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Paymentsrequests.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Paymentsrequests in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Paymentsrequests.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Paymentsrequests from the DB
export function destroy(req, res) {
  return Paymentsrequests.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
