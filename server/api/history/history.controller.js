/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/historys              ->  index
 * POST    /api/historys              ->  create
 * GET     /api/historys/:id          ->  show
 * PUT     /api/historys/:id          ->  update
 * DELETE  /api/historys/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import History from './history.model';

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

// Gets a list of Historys
export function index(req, res) {
  return History.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single History from the DB
export function show(req, res) {
  return History.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// geeting  a new Complaint History from  the DB
export function getComplaintHistory(req, res) {
  return History.aggregate([
                     {"$match":{complaintId:req.body.complaintId}},
                     {"$lookup": {
                               from:"users",
                              localField:"userInfoId",
                             foreignField:"userId",
                             as:"userTotalInfo"
                      }
                    }
                     ])
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing History in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return History.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a History from the DB
export function destroy(req, res) {
  return History.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
