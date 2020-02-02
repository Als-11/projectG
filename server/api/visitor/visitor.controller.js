/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/visitors              ->  index
 * POST    /api/visitors              ->  create
 * GET     /api/visitors/:id          ->  show
 * PUT     /api/visitors/:id          ->  update
 * DELETE  /api/visitors/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Visitor from './visitor.model';
import jwt from 'jsonwebtoken';

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function (entity) {
        if (entity) {
            res.status(statusCode).json(entity);
        }
    };
}

function saveUpdates(updates) {
    return function (entity) {
        var updated = _.merge(entity, updates);
        return updated.save()
            .then(updated => {
                return updated;
            });
    };
}

function removeEntity(res) {
    return function (entity) {
        if (entity) {
            return entity.remove()
                .then(() => {
                    res.status(204).end();
                });
        }
    };
}

function handleEntityNotFound(res) {
    return function (entity) {
        if (!entity) {
            res.status(404).end();
            return null;
        }
        return entity;
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function (err) {
        res.status(statusCode).send(err);
    };
}

//get highest visitors(communityAdmin dashboard)
export function getHighestVisitors(req, res) {
    var use = jwt.decode(req.cookies.token);
    return Visitor.aggregate({$match:{communityId:use.communityId}},
                           {$group:{"_id":{blockName:"$blockName",flatNo:"$flatNo",firstName:"$name"},
                            count:{$sum:1}}},{$sort:{count:-1}},{$limit:5}).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a list of Visitors
export function index(req, res) {
    var use = jwt.decode(req.cookies.token);
    return Visitor.find({
            communityId: use.communityId,
        }).sort({
            visitorId: -1
        }).exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

//
export function getVisitors(req, res) {
    var use = jwt.decode(req.cookies.token);
    var date = new Date();
     var from = date.getDate()-1;
     var fromdate = new Date();
     fromdate.setDate(from);
     if(use.role == "COMMUNITY_ADMIN") {
      var userId = use.communityId;
      return Visitor.aggregate([
       { "$match":{"$and":[{"communityId":userId,"inTime":{$lte:date}},
                       {"communityId":userId,"inTime":{$gte:fromdate}},
                       ]}
            } 
     ]).then(respondWithResult(res))
        .catch(handleError(res));

    }
    else {
      var userId = use.userId; 
      return Visitor.aggregate([
       { "$match":{"$and":[{userId:userId,"inTime":{$lte:date}},
                       {userId:userId,"inTime":{$gte:fromdate}},
                       ]}
            } 
     ]).then(respondWithResult(res))
        .catch(handleError(res));
    }
}


export function getMonthlyVisitors(req, res) {  //user expenses(group by monthly)
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
      return Visitor.aggregate([ 
       {
        "$match":{"$and":[{"communityId":userId,"inTime":{$lte:endDate}},
                       {"communityId":userId,"inTime":{$gte:fromDate}},
                       ]}    
     },
                                     
    { "$project": {
        "month": { "$month": "$inTime" }
    }}, 
    { "$group": {
        "_id":  { "month": "$month"},
        "count":{"$sum":1}
       
    }},
    {"$sort":{"_id.month":1}}
])
    .then(respondWithResult(res))
    .catch(handleError(res));
  }
  else{
    var userId = use.userId;
      return Visitor.aggregate([ 
       {
        "$match":{"$and":[{"userId":userId,"inTime":{$lte:endDate}},
                       {"userId":userId,"inTime":{$gte:fromDate}},
                       ]}    
     },
                                     
    { "$project": {
        "month": { "$month": "$inTime" }
    }}, 
    { "$group": {
        "_id":  { "month": "$month"}, 
         "count":{"$sum":1}
    }},
    {"$sort":{"_id.month":1}}
])
    .then(respondWithResult(res))
    .catch(handleError(res))
  } 
    
}

export function getSkippedVisitors(req, res) {
    var use = jwt.decode(req.cookies.token); 
    var skip=(req.body.count)*10;
    var count=parseInt(skip); 
    return Visitor.find({communityId:use.communityId}).skip(count).limit(10).exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}



// Gets a single Visitor from the DB
export function show(req, res) {
    return Visitor.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

//here we get RESIDENT related visitors
export function userVisitors(req, res) {
    var use = jwt.decode(req.cookies.token);
    return Visitor.find({communityId:use.communityId,userId:use.userId}).limit(20).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

export function userSkippedVisitors(req, res) {
    var use = jwt.decode(req.cookies.token);
    var count=(req.body.count)*10;
    return Visitor.find({communityId:use.communityId,userId:use.userId}).skip(count).limit(20).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new Visitor in the DB
export function create(req, res) {
    return Visitor.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// creating a new visitor here in visitor DB
export function createVisitor(req, res) {
    var use = jwt.decode(req.cookies.token);
    req.body.provier = 'local';
    return Visitor.create({
            communityId: use.communityId,
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            blockName: req.body.blockName,
            floorNumber: req.body.floorNumber,
            flatNo: req.body.flatNo,
            purpose: req.body.purpose,
            userId:req.body.userId,
            alongWith:req.body.alongWith,
            inTime: new Date(),
            outTime: "",
            status:"active",
            vehicleNo: req.body.vehicleNo,
            securityId: use.userId
        })
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

export function visitorsLeft(req, res) {
    return Visitor.update({
            visitorId: req.body.visitorId
        }, {
            $set: {
                outTime: new Date(),
                status:"away"
            }
        }).exec()
        .then(handleEntityNotFound(res))

    .then(function (data) {
            return Visitor.findOne({
                    visitorId: req.body.visitorId
                }).exec()
                .then(respondWithResult(res))
        })
        .catch(handleError(res));
}



export function updateOutTime(req, res) {
    return Visitor.update({
            visitorId: req.body.visitorId
        }, {
            $set: {
                outTime: new Date(),
                status:"away"
            }
        }).exec()
        .then(handleEntityNotFound(res))

    .then(function (data) {
            return Visitor.findOne({
                    visitorId: req.body.visitorId
                }).exec()
                .then(respondWithResult(res))
        })
        .catch(handleError(res));
}


//count for Number of visitors
export function visitorsCount(req, res) {
    var use = jwt.decode(req.cookies.token);
    return Visitor.count({
            communityId: use.communityId
        }).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Updates an existing Visitor in the DB
export function update(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    return Visitor.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(saveUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes the visitor from Db using visitor id

export function deleteVisitor(req, res) {
    var use = jwt.decode(req.cookies.token);
    return Visitor.findOne({
            communityId: use.communityId,
            visitorId: req.body.visitorId
        }).remove().exec()
        .then(function () {
            res.status(204).end();
        })
        .catch(handleError(res));
}

// Deletes a Visitor from the DB
export function destroy(req, res) {
    return Visitor.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}