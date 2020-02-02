 /**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/amenitiesBookings              ->  index
 * POST    /api/amenitiesBookings              ->  create
 * GET     /api/amenitiesBookings/:id          ->  show
 * PUT     /api/amenitiesBookings/:id          ->  update
 * DELETE  /api/amenitiesBookings/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import AmenitiesBooking from './amenitiesBooking.model';
import Amenity from '../amenity/amenity.model';
import User from '../user/user.model';
import jwt from 'jsonwebtoken';

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

// Gets a list of AmenitiesBookings
export function index(req, res) {
  return AmenitiesBooking.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single AmenitiesBooking from the DB
export function show(req, res) {
  return AmenitiesBooking.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new AmenitiesBooking in the DB
export function create(req, res) {
  return AmenitiesBooking.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// booking history(user)
export function bookingHistory(req, res) {
  var use = jwt.decode(req.cookies.token);
  return AmenitiesBooking.aggregate([
       {"$match":{blockedBy:use.userId}},
      {"$lookup": {
            from: "amenities",
            localField: "amenityId",
            foreignField: "amenityId",
            as: "RespectiveAmenity"
          }},
          {$sort:{bookingId:-1}}
        ])
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}


//list Of Amenities(Admin)
export function latestBooking(req, res) {
  var use = jwt.decode(req.cookies.token);
  return AmenitiesBooking.aggregate([
    {"$match":{communityId:use.communityId,approvalStatus:"PENDING"}},
    {"$lookup": {
            from: "users",
            localField: "blockedBy",
            foreignField: "userId",
            as: "userInfo"
            }},
         //Amenity Info
    {"$lookup": {
            from: "amenities",
            localField: "amenityId",
            foreignField: "amenityId",
            as: "RespectiveAmenity"
          }},
   { "$group": {
        "_id":  { "bookingId": "$bookingId","AmenityInfo":"$RespectiveAmenity","userInfo":"$userInfo","blockedFrom":"$blockedFrom",
                    "blockedTo":"$blockedTo"}
    }},
    {"$sort":{"_id.bookingId":-1}}
        ])
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// export function latestBooking(req, res) {
//     var use = jwt.decode(req.cookies.token); 
//     return AmenitiesBooking.aggregate ([
//     // Filter possible documents   
//     // Unwind the array to denormalize
//     { "$unwind": "$timeslots" },

//     // Match specific array elements
//     { "$match": { "timeslots.approvalStatus": "PENDING" ,"communityId":use.communityId} },

//     //user info
//     {"$lookup": {
//             from: "users",
//             localField: "timeslots.blockedBy",
//             foreignField: "userId",
//             as: "Respectivethread"
//           }
//         },
//      //Amenity Info
//     {"$lookup": {
//             from: "amenities",
//             localField: "amenityId",
//             foreignField: "amenityId",
//             as: "RespectiveAmenity"
//           }
//         },
//     // Group back to array form
//     { "$group": { "_id": { Respectivethread: "$Respectivethread", timeslots: "$timeslots", RespectiveAmenity:"$RespectiveAmenity"}
//     }}
// ]).exec()
//     .then(respondWithResult(res))
//      .catch(handleError(res));

// }

export function getBookings(req, res){
    var startDate = new Date(req.body.startDate);
    startDate.setHours(0,0,0,0); 
    return AmenitiesBooking.aggregate([
                                      {$match:
                                       {"$or":[{"amenityId":req.body.amenityId,"date":new Date(req.body.startDate),approvalStatus:"PENDING"},
                                       {"amenityId":req.body.amenityId,"date":new Date(req.body.startDate),approvalStatus:"APPROVED"}
                                      ]}}
                                     ]).then(handleEntityNotFound(res))
                                       .then(respondWithResult(res))
                                       .catch(handleError(res));     
}

export function makeBooking(req,res){
  var use = jwt.decode(req.cookies.token);
  var userId = use.userId;
   var startDate = new Date(req.body.startDate); 
   var desiredDate = startDate.setHours(0,0,0,0);  // for maintaing date as same in db
  startDate.setHours(req.body.startTime,0,0,0);
  var endDate = new Date(req.body.startDate);
  endDate.setHours(req.body.endTime,0,0,0) 
  // var hoursSlots = startDate - endDate;
  // var numOfHours = (req.body.endTime - req.body.startTime);

  Amenity.findOne({amenityId : req.body.amenityId},function(err,data){
        if(data!==null){
             return AmenitiesBooking.create({
                amenityId :data.amenityId,
                date:desiredDate,
                communityId:use.communityId,
                blockedBy:use.userId,
                blockedFrom:startDate,
                blockedTo:endDate,
                blockedOn : new Date(),
                approvalStatus:"PENDING"
              }).then(respondWithResult(res))
               .catch(handleError(res));
          }
      })
}

export function amenityApproved(req, res) {
  var use = jwt.decode(req.cookies.token);
  var amenityInfo = req.body.amenityid;
  return AmenitiesBooking.update({amenityId:req.body.amenityId,bookingId:req.body.bookingId},
                                  {$set:{approvalStatus:"APPROVED", approvedOn:new Date()}}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function amenityDeclined(req, res) {
  var use = jwt.decode(req.cookies.token);
  var amenityInfo = req.body.amenityid;
  return AmenitiesBooking.update({amenityId:req.body.amenityId,bookingId:req.body.bookingId},
                                  {$set:{approvalStatus:"REJECTED", rejectedOn:new Date()}}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}


// Updates an existing AmenitiesBooking in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return AmenitiesBooking.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a AmenitiesBooking from the DB
export function destroy(req, res) {
  return AmenitiesBooking.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
