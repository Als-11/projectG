/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/userbillservices              ->  index
 * POST    /api/userbillservices              ->  create
 * GET     /api/userbillservices/:id          ->  show
 * PUT     /api/userbillservices/:id          ->  update
 * DELETE  /api/userbillservices/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Userbillservice from './userbillservice.model';
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

// Gets a list of Userbillservices
export function index(req, res) {
  return Userbillservice.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Userbillservice from the DB
export function show(req, res) {
  return Userbillservice.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// get user specific bills
export function getbills(req, res) {
  var use = jwt.decode(req.cookies.token);
  return Userbillservice.find({userId:use.userId}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function updateUserBillDetails(req, res) {
  var use = jwt.decode(req.cookies.token);
  var communityId;
  if(use.role === 'COMMUNITY_ADMIN'){
      communityId = use.communityId;
  }
  else{
       communityId = null;
  }
  return Userbillservice.update({"communityId":communityId,
                                 "userId":use.userId,
                                  "billServiceId":req.body.billServiceId},
                                 {$set: {
                                 "uniqueId":req.body.uniqueId,
                                 "operator":req.body.operator,
                                 "Category":req.body.category}},{safe:true}).exec()
    .then(handleEntityNotFound(res))
    .then(function(data) {
      return Userbillservice.find({userId:use.userId}).exec()
      .then(respondWithResult(res))
    })
    .catch(handleError(res));
}

// Creates a new Userbillservice in the DB
export function saveBillservice(req, res) {
  var use = jwt.decode(req.cookies.token);
  var communityId;
  if(use.role === 'COMMUNITY_ADMIN'){
      communityId = use.communityId;
  }
  else{
       communityId = null
  }
  return Userbillservice.create({"communityId":communityId,"userId":use.userId,
                                 "billServiceId":req.body.billServiceId,
                                 "uniqueId":req.body.uniqueId,
                                  "operator":req.body.operator,
                                  "Category":req.body.category})
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Userbillservice in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Userbillservice.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Userbillservice from the DB
export function destroy(req, res) {
  return Userbillservice.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
