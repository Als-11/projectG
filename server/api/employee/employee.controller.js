/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/employees              ->  index
 * POST    /api/employees              ->  create
 * GET     /api/employees/:id          ->  show
 * PUT     /api/employees/:id          ->  update
 * DELETE  /api/employees/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Employee from './employee.model';
import User from '../user/user.model';
import pwdgen from 'password-generator';
import jwt from 'jsonwebtoken';
import Complaint from '../complaint/complaint.model';

var generatePassword = require('password-generator');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

export function getEmployees(req,res){
    var use = jwt.decode(req.cookies.token);
    return Employee.distinct('employeeType',{communityId:use.communityId,role:'EMPLOYEE'}).exec()
     .then(handleEntityNotFound(res))
        .then(respondWithResult(res))        
        .catch(handleError(res));
  }

  export function getemployeeNames(req,res){
    var use = jwt.decode(req.cookies.token);
    return Employee.find({communityId:use.communityId,employeeType:req.body.employeeType},
                        {firstName:1,userId:1,employeeId:1,phoneNumber:1,employeeType:1}).exec()
     .then(handleEntityNotFound(res))
        .then(respondWithResult(res))        
        .catch(handleError(res));
  }

  export function getEmployeeType(req,res) {
   var use = jwt.decode(req.cookies.token);
     return User.findOne({communityId:use.communityId,userId:use.userId}).exec()
     .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
  }

  export function getEmployeeNme(req,res) {
   var use = jwt.decode(req.cookies.token);
     return User.findOne({communityId:use.communityId,userId:req.body.userId}).exec()
     .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
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

// Gets a list of Employees
export function index(req, res) {
var use = jwt.decode(req.cookies.token);
  return User.find({communityId:use.communityId,role:"EMPLOYEE"}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Employee from the DB
export function show(req, res) {
  return Employee.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function assignedemployeName(req, res){
  var use = jwt.decode(req.cookies.token);
  Employee.find({employeeId:req.body.employeeId})
  .then(function(data){
    return User.find({userId:data[0].userId})
    .then(respondWithResult(res))
    .catch(handleError(res));
  })
}

// Creates a new Employee in the DB
export function create(req, res) {
  var use = jwt.decode(req.cookies.token);
  var employeeId;
  req.body.provider = 'local';
   User.create({    email: req.body.emailId,
                          firstName: req.body.firstName,
                          communityId:use.communityId,//here only error comes
                          lastName :req.body.lastName,
                          Gender :req.body.Gender,
                          phoneNumber :req.body.phoneNumber,
                          password: req.body.firstName+"_"+req.body.lastName,
                          role: "EMPLOYEE",
                          imageUrl:req.body.imageUrl,
                          employeeType:req.body.occupation,
                          lockUntil:0})
    .then(function(data)
    { 
         if(req.body.occupation == "SECURITY") {
          employeeId = "GS"+data.userId
         }
         else if(req.body.occupation == "GARDENING") {
          employeeId = "GG"+data.userId
         }
          else if(req.body.occupation == "PLUMBER") {
          employeeId = "GP"+data.userId
         }
          else if(req.body.occupation == "ELECTRICIAN") {
          employeeId = "GE"+data.userId
         }
         else if(req.body.occupation == "CARPENTRY") {
          employeeId = "GC"+data.userId
         }
         else if(req.body.occupation == "OTHERS") {
          employeeId = "GO"+data.userId
         }
          Employee.create({  email: req.body.emailId,
                          firstName: req.body.firstName,
                          communityId:use.communityId,//here only error comes
                          lastName :req.body.lastName,
                          gender :req.body.Gender,
                          employeeType:req.body.occupation,
                          phoneNumber:req.body.phoneNumber,
                          fromDate: req.body.fromDate,
                          toDate: null,
                          salary:req.body.salary,
                          salaryDate:req.body.salaryDate,
                          userId:data.userId,
                          employeeId: employeeId
                        })
                   .then(respondWithResult(res))
                   .catch(handleError(res));
    }) 
}

export function electriciansDetails(req, res) {
  var use = jwt.decode(req.cookies.token);
return Employee.aggregate([{ "$match":{communityId:use.communityId,employeeType:req.body.selectedCategory}},
                           {"$lookup":{
                    from:"users",
                    localField:"userId",
                    foreignField:"userId",
                    as:"userinfo"
                  }
                  }]).exec()
    .then(handleEntityNotFound(res))
       .then(respondWithResult(res))
       .catch(handleError(res));
}
export function getRespectiveEmployees(req, res) {   //employees to assign the complaint (complaints view)
  var use = jwt.decode(req.cookies.token);
  var status = req.body.status;
  if(status == "Assigned") {
     Complaint.find({complaintId:req.body.complaintId})
     .then(function(data)
     { 
         return Employee.find({userId:data[0].assignedId}).exec()
         .then(respondWithResult(res))
         .catch(handleError(res));
     })
  }
else if(status == "Open") {
return Employee.aggregate([{ "$match":{communityId:use.communityId,employeeType:req.body.selectedCategory}},
                           {"$lookup":{
                    from:"users",
                    localField:"userId",
                    foreignField:"userId",
                    as:"userinfo"
                  }
                  }]).exec()
    .then(handleEntityNotFound(res))
       .then(respondWithResult(res))
       .catch(handleError(res));
  }
}

export function totalemployeecount(req, res) {
  var use = jwt.decode(req.cookies.token); 
  return Employee.aggregate(
   [
     {
       $match:{ communityId:use.communityId
          }
      },
      {
        $group : {
           _id : { communityId: "$communityId",employeeType:"$employeeType"},
           count:{$sum:1}
       }},
       {
        $project : {
           _id : 0,
            role:"$_id.employeeType",
           count:1
        }}
   ]
)
       .then(respondWithResult(res))
       .catch(handleError(res));
}


//Here we set To Date for Employee
export function setToDate(req, res) { 
  var use = jwt.decode(req.cookies.token);
     return User.update({communityId:use.communityId, userId: req.body.employeeId},
                          {$set:{toDate:req.body.toDate,
                            phoneNumber:req.body.phoneNumber,
                            salary: req.body.salary,salaryDate:req.body.salaryDate}},{safe:true}).exec()
        .then(function(data) {
      return Employee.update({communityId:use.communityId,userId:req.body.employeeId},
                              {$set:{toDate:req.body.toDate,
                            phoneNumber:req.body.phoneNumber,
                            salary: req.body.salary,salaryDate:req.body.salaryDate}},{safe:true}).exec()
      .then(respondWithResult(res))
        .catch(handleError(res));
      }).then(respondWithResult(res))
        .catch(handleError(res));
}

// Updates an existing Employee in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Employee.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Employee from the DB
export function destroy(req, res) {
  return User.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
//delete the employees
export function deleteEmployee(req, res) {
  return Employee.find({userId:req.body.userId}).remove().exec()
    .then(handleEntityNotFound(res))
      .then(respondWithResult(res))
    .catch(handleError(res));
}