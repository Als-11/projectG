/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/complaints              ->  index
 * POST    /api/complaints              ->  create
 * GET     /api/complaints/:id          ->  show
 * PUT     /api/complaints/:id          ->  update
 * DELETE  /api/complaints/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Complaint from './complaint.model';
import jwt from 'jsonwebtoken';
import User from '../user/user.model';
import History from '../history/history.model';
import Employee from '../employee/employee.model';
import comment from '../comment/comment.model';
import Notifications from '../notifications/notifications.model';


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
//search box on thecomplaints table view 
export function getSuggestions(req,res)
{
  var key = (req.body.keyword);
  return Complaint.aggregate([{"$match":{"assigned" : { $regex : new RegExp("^"+key,"i")}}},
                               {"$lookup":{
                                  from:"users",
                                  localField:"userId",
                                  foreignField:"userId",
                                  as:"userinfo"
                                  }
                               },
                               {"$lookup":{
                                  from:"comments",
                                  localField:"complaintId",
                                  foreignField:"complaintId",
                                  as:"commentInfo"
                                  }
                                }
                              ])  //ignoring the case
  .then(respondWithResult(res))
  .catch(handleError(res));
}


  //Complaints on Employee Dashboard
  export function getComplaint(req, res) {
      var use = jwt.decode(req.cookies.token);
  return Complaint.aggregate([
    {"$match":{communityId:use.communityId,assignedId:use.userId}},
    {"$lookup":{
      from:"users",
      localField:"userId",
      foreignField:"userId",
      as:"UserInfo"
    }}])
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
  }

// Gets a list of Complaints based on the userid(resident)
export function index(req, res) {
   var use = jwt.decode(req.cookies.token);
  return Complaint.aggregate([
               {$match:{communityId:use.communityId,userId:use.userId}},
                 {"$lookup" : {
                      from: "users",
                      localField: "userId",
                      foreignField: "userId",
                      as: "userinfo"
                       }
                 },
                 {"$lookup":{
                    from:"comments",
                    localField:"complaintId",
                    foreignField:"complaintId",
                    as:"commentInfo"
                 }},                 
                 {$sort:{complaintId:-1}}])//-1=>descending order
    .then(respondWithResult(res))
    .catch(handleError(res));
  }

//list of complaints based on the communityId(Admin) & sortng based on complaintId
export function listComplaints(req, res) {
     var use = jwt.decode(req.cookies.token);
     var employeeCategory = req.body.employeeCategory;
     if(employeeCategory == undefined||employeeCategory ==  null){
  return Complaint.aggregate([
               {$match:{communityId:use.communityId}},
                 {"$lookup" : {
                      from: "users",
                      localField: "userId",
                      foreignField: "userId",
                      as: "userinfo"
                       }
                 },
                 {"$lookup" : {
                      from: "employees",
                      localField: "assignedId",
                      foreignField: "userId",
                      as: "employeeinfo"
                       }
                 },
                 {"$lookup":{
                    from:"comments",
                    localField:"complaintId",
                    foreignField:"complaintId",
                    as:"commentInfo"
                 }},                 
                 {$sort:{complaintId:-1}}])//-1=>descending order
    .then(respondWithResult(res))
    .catch(handleError(res));
  }
  else {
      return Complaint.aggregate([
               {$match:{communityId:use.communityId,category:req.body.employeeCategory}},
                 {"$lookup" : {
                      from: "users",
                      localField: "userId",
                      foreignField: "userId",
                      as: "userinfo"
                       }
                 },
                 {"$lookup" : {
                      from: "employees",
                      localField: "assignedId",
                      foreignField: "userId",
                      as: "employeeinfo"
                       }
                 },
                   {"$lookup":{
                    from:"comments",
                    localField:"complaintId",
                    foreignField:"complaintId",
                    as:"commentInfo"
                 }},
                 {$sort:{complaintId:-1}}])//-1=>descending order
    .then(respondWithResult(res))
    .catch(handleError(res));
  }

}

// export function respectivePerson(req, res) {
//      var use = jwt.decode(req.cookies.token);
//   return Complaint.aggregate([{$match:{assignedId:use.userId,status:"Assigned"}},
//                    {"$lookup":{  from: "users",
//                            localField: "userId",
//                            foreignField: "userId",
//                            as: "userinfo"
//                        }
//                  },
//                  {$sort:{complaintId:-1,commentId:-1}}])//-1=>descending order
//     .then(respondWithResult(res))
//     .catch(handleError(res));
// }

export function countComplaints(req, res) {
     var use = jwt.decode(req.cookies.token);
return Complaint.aggregate(
   [ 
    {
       $match:
          {"$or":[{"communityId":use.communityId,status:"Open"},
                   {"communityId":use.communityId,status:"Assigned"},
                   {"communityId":use.communityId,status:"Hold"},
                   {"communityId":use.communityId,status:"Pending"},
                 ]}}
])
        .then(respondWithResult(res))
        .catch(handleError(res));
}

export function complaintsCounts(req, res) {   //complaints count for employee role
     var use = jwt.decode(req.cookies.token);
  return Complaint.aggregate([ { $match : { $or: [ { assignedId: use.userId,status:"Assigned" }, 
                                                    { assignedId:use.userId,status:"Closed" },
                                                     { assignedId:use.userId,status:"Pending" },
                                                      { assignedId:use.userId,status:"Rejected" } ] }},
                                          { $group: { "_id": { status: "$status"},
                                             count:{$sum:1}
                                          }}
                                         ]).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}


export function complaintCount(req, res) {
     var use = jwt.decode(req.cookies.token);

  return Complaint.aggregate(
   [ 
    {
       $match:
          {"$or":[{"communityId":use.communityId,status:"Open"},
                   {"communityId":use.communityId,status:"Assigned"},
                   {"communityId":use.communityId,status:"Pending"},
                 ]}    
     },
      {
        $group : {
           _id : { communityId: "$communityId",category:"$category"},
           count:{ $sum: 1 }
       }},
       {
        $project : {
           _id : 0,
            role:"$_id.category",
           count:1
        }}
   ]
).exec()
   .then(respondWithResult(res))
    .catch(handleError(res));
  }

  // export function getComments(req, res) {
  //   var use = jwt.decode(req.cookies.token);
  //   return Complaint.find({communityId:use.communityId})
  //   .then(function(data){ 
  //     for(var i=0;i<data.length;i++){ 
  //       Comment.find({complaintId:data[i].complaintId}).exec()
  //     }
  //   }).then(respondWithResult(res))
  //     .catch(handleError(res));
  // }


  //Respective complaint complaints to the particular employee
  export function respectivecomplaint(req, res) {
      var use = jwt.decode(req.cookies.token);
  return Complaint.aggregate([
    {"$match":{communityId:use.communityId,assignedId:use.userId,status:req.body.status}},
    {"$lookup":{
      from:"users",
      localField:"userId",
      foreignField:"userId",
      as:"UserInfo"
    }}
    ])
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
  }


//assign the compliant based on the category(commnityAdmin)
export function assignCompliant(req, res) {
  var use = jwt.decode(req.cookies.token);
  Complaint.update({communityId:use.communityId,complaintId:req.body.complaintId},
     {$set:{category:req.body.category,assigned:req.body.assigned,status:"Assigned",employeeId:req.body.employeeId,
              updatedAt:new Date(),assignedId:req.body.assingedId}}).exec()
   .then(function(data){
    return Complaint.findOne({communityId:use.communityId,complaintId:req.body.complaintId}).exec()
     }).then(respondWithResult(res))
     .catch(handleError(res))
     .then(function(data) {
       History.create({complaintId:req.body.complaintId,userId:use.userId,createdAt:new Date(),
                                    userInfoId:req.body.assingedId, text:" is assigned with the complaint at" })
        
       
       })
          .then(function(data)
        {  
              if(req.body.description != null){
          comment.create({complaintId:req.body.complaintId,threadId:null,
                                description:req.body.description,userId:use.userId,
                                userName:use.firstName
                                })
           }
          })
           .then(function(data)
              {
                  if(req.body.description != null){
                   History.create({complaintId:data.complaintId,userId:use.userId,createdAt:data.createdAt,
                                     userInfoId:use.userId,text:" says " +req.body.description})
                  } 
              })
     .then(respondWithResult(res))
     .catch(handleError(res)); 
}


// //card Specific complaints
// export function cardcomplaints(req,res){
//   var use = jwt.decode(req.cookies.token);
//   return Complaint.aggregate([
//                {$match:{communityId:use.communityId}},
//                  {"$lookup" : {
//                       from: "users",
//                       localField: "userId",
//                       foreignField: "userId",
//                       as: "userinfo"
//                        }
//                  },
//                  {$sort:{complaintId:-1}}]).exec()
//    .then(handleEntityNotFound(res))
//     .then(respondWithResult(res))
//     .catch(handleError(res));
// }


export function employeeCategoryComplaints(req,res){
  var use = jwt.decode(req.cookies.token);
  return Complaint.find({communityId:use.communityId,category:req.body.employeeType,status:'Open'}).exec()
   .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

//get assignedpersons based on the category
export function getassignedPersons(req, res) {
  var use = jwt.decode(req.cookies.token);
  return User.find({communityId:use.communityId,role:"EMPLOYEE"},{firstName:1,lastName:1,userId:1}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Complaint from the DB
export function show(req, res) {
  return Complaint.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Complaint in the DB
export function create(req, res) {
  var use = jwt.decode(req.cookies.token);
  return Complaint.create({ title:req.body.title,
                            complaintdescription:req.body.complaintdescription,
                            communityId:use.communityId,
                            userId:use.userId,
                            userName:use.firstName,
                            category:req.body.category,
                            status:"Open",
                            createdAt:new Date()
                        })
    .then(function(data)
       {
          return History.create({complaintId:data.complaintId,userId:use.userId,createdAt:data.createdAt,
                                    userInfoId:use.userId, text:"has been raised the Complaint at "})
       })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Complaint in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Complaint.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Complaint from the DB
export function destroy(req, res) {
  return Complaint.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}