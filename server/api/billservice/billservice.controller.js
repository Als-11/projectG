/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/billservices              ->  index
 * POST    /api/billservices              ->  create
 * GET     /api/billservices/:id          ->  show
 * PUT     /api/billservices/:id          ->  update
 * DELETE  /api/billservices/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Billservice from './billservice.model';
import UserServices from '../../models/UserServices.model';
import ElectricityProviders from '../../models/ElectricityProviders.model';
import electricityService from './electricityservice.controller';

import cron from 'node-schedule';


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

// Gets a list of Billservices category
export function index(req, res) {
  return Billservice.distinct('category').exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

//based on the category,retrive the billservice data
export function userSelectedCategory(req, res) {
  return Billservice.find({"category":req.body.category}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
} 
//based on the user selected operator,retrive the particular record
 export function userSelectedoperator(req, res) {
  return Billservice.findOne({"category":req.body.category,"provider":req.body.operator}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}
// Gets a single Billservice from the DB
export function show(req, res) {
  return Billservice.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Billservice in the DB
export function create(req, res) {
  return UserServices.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Billservice in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Billservice.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Billservice from the DB
export function destroy(req, res) {
  return Billservice.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

export function createTransaction(instance) {
    return instance.save().then(function(val) { 
    });
}
    
//cron.scheduleJob('2 * * * * *', function(){ 
//    //paytmRequest();
//   // electricityService.billDeskUtility();
//    //electricityService.recordCurrentBills();
//});
