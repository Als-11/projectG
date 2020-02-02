/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/amenities              ->  index
 * POST    /api/amenities              ->  create
 * GET     /api/amenities/:id          ->  show
 * PUT     /api/amenities/:id          ->  update
 * DELETE  /api/amenities/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Amenity from './amenity.model';
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




// Gets a list of Amenitys
export function redirectUser(req, res) {
    var use = jwt.decode(req.cookies.token);  
    if(use.role == 'COMMUNITY_ADMIN' || use.role == 'RESIDENT'){
      res.send('/dashboard');
    }
     if(use.role == 'SERVICE_PROVIDER'){
      res.send('/servicesdashboard');
    }
     if(use.role == 'GUWHA_EMPLOYEE'){
      res.send('/guwhaemployee');
    }
     if(use.role == 'SUPER_ADMIN'){
      res.send('/superadmin');
    }
    if(use.role == 'EMPLOYEE'){
      if(use.employeeType === 'SECURITY'){
          res.send('/employeedashboard/visitors')
      }
   else if(use.employeeType != 'SECURITY'){
        res.send('/employeedashboard') 
      }
  }

   
}

// Gets a list of Amenitys
export function index(req, res) {
    var use = jwt.decode(req.cookies.token);  
  return Amenity.find({adminCommunityId:use.communityId}).exec()  //based on the communityId we reteriew the ammenities
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Amenity from the DB
// export function show(req, res) {
//   return Amenity.findById(req.params.id).exec()
//     .then(handleEntityNotFound(res))
//     .then(respondWithResult(res))
//     .catch(handleError(res));
// }

// Creates a new Amenity in the DB
export function create(req, res) {
  return Amenity.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}


   //get  Amenity Details from the DB
export function getAmenityDetail(req, res) {
  return Amenity.findOne({amenityName:req.body.amenityName})
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
} 


   //get  Amenity Details from the DB
export function getAmenityNames(req, res) {
   var use = jwt.decode(req.cookies.token); 
  return Amenity.find({adminCommunityId:use.communityId},{amenityName:1})
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
    }
// export function addCommunity(req,res) {
//     return Amenity.findOneAndUpdate(
//     {amenityId : req.params.id},
//     {$push : { communityIds :  req.body.altCommunityId}},
//     {safe : true, upsert:true, new:true})
//         .then(respondWithResult(res, 201))
//         .catch(handleError(res));
// }
// Updates an existing Amenity in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Amenity.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Amenity from the DB
export function destroy(req, res) {
  return Amenity.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

//deletes an amenity based on the amenityid


export function deleteAmenity(req, res) { 
  return Amenity.find({amenityId:req.body.amenityId}).remove().exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}