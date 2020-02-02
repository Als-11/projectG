/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/floors              ->  index
 * POST    /api/floors              ->  create
 * GET     /api/floors/:id          ->  show
 * PUT     /api/floors/:id          ->  update
 * DELETE  /api/floors/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Floors from './floors.model';
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

// Gets a list of Floorss
export function getMaintnceDetails(req, res) {
  var use = jwt.decode(req.cookies.token); 
  return Floors.find({communityId:use.communityId}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function inlineEdit(req, res) {
  var use = jwt.decode(req.cookies.token); 
  return Floors.update({houseNumber:req.body.houseNumber},{"$set":{maintenanceCost:req.body.maintenanceCost,
                      flatType:req.body.flatType}})
    .then(respondWithResult(res))
    .catch(handleError(res));
}


// Creates a new Floors in the DB
export function flatnumberSearch(req, res) {
   var key = (req.body.keyword);
     var use = jwt.decode(req.cookies.token); 
  return Floors.find({flatNumber:{ $regex : new RegExp("."+key)},communityId:use.communityId})
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

export function bulkEditSave(req, res) {
  var use = jwt.decode(req.cookies.token);
   Floors.find({flatType:req.body.flatType})
  .then(function(data)
  {
    for(var i=0;i<req.body.array.length;i++){
      Floors.update({houseNumber:req.body.array[i].houseNumber},{"$set":{maintenanceCost:req.body.cost,
                      flatType:req.body.flatType}
                    }).then(function(data)
                    {
                      console.log(data);
                    }) 

   }
  }).then(function(data)
  {
    return Floors.find({flatType:req.body.flatType})
  .then(respondWithResult(res, 201))
    .catch(handleError(res));
  })
  
}


// Creates a new Floors in the DB
export function suggestions(req, res) {
   var key = (req.body.keyword);
  return Floors.find({flatNumber:{ $regex : new RegExp("^"+key)},communityId:req.body.communityId})
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Floors in the DB 
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Floors.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Floors from the DB
export function destroy(req, res) {
  return Floors.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
