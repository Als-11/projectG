/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/communitymembersmappings              ->  index
 * POST    /api/communitymembersmappings              ->  create
 * GET     /api/communitymembersmappings/:id          ->  show
 * PUT     /api/communitymembersmappings/:id          ->  update
 * DELETE  /api/communitymembersmappings/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Communitymembersmapping from './communitymembersmapping.model';
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

// Gets a list of Communitymembersmappings
export function communitymemberslist(req, res) {
    var use = jwt.decode(req.cookies.token);
  return Communitymembersmapping.find({communityId:use.communityId}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

//count for members
export function membersCount(req, res) {
    var use = jwt.decode(req.cookies.token);
  return Communitymembersmapping.count({communityId:use.communityId}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
// Gets a single Communitymembersmapping from the DB
export function updatememberslist(req, res) { 
    var use = jwt.decode(req.cookies.token);
  return Communitymembersmapping.update({communityId:use.communityId,communitymemberId:req.body.communityMemberId},
                                         {$set:{phoneNumber:req.body.phoneNumber,toDate:req.body.toDate}}).exec()
    .then(handleEntityNotFound(res))
    .then(function(data) {
      return Communitymembersmapping.find({communityId:use.communityId}).exec()
      .then(respondWithResult(res))
    })
    .catch(handleError(res));
}

// Creates a new Communitymembersmapping in the DB
export function createmember(req, res) { 
  var use = jwt.decode(req.cookies.token);
  var fromDate = new Date(req.body.fromDate);
   var from = fromDate.setHours(0,0,0,0);
  if(req.body.endDate === null){
    var end = null;
  }
  else {
  var endDate =new Date(req.body.endDate);
   var end= endDate.setHours(0,0,0,0)
   }
  return Communitymembersmapping.create({
                                          name:req.body.name,
                                          emailId:req.body.emailId,
                                          userId:req.body.userId,
                                          phoneNumber:req.body.phoneNumber,
                                          roleType:req.body.roleType,
                                          fromDate:from,
                                          communityId:use.communityId,
                                          toDate:end,
                                          roleId:'COMMUNITY_MEMBER'
  })
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Communitymembersmapping in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Communitymembersmapping.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Communitymembersmapping from the DB
export function destroy(req, res) {
  return Communitymembersmapping.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
