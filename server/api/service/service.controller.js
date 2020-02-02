/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/services              ->  index
 * POST    /api/services              ->  create
 * GET     /api/services/:id          ->  show
 * PUT     /api/services/:id          ->  update
 * DELETE  /api/services/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Service from './service.model';
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

// Gets a list of Services
export function getServices(req, res) {
  return Service.find({},{serviceCategory:1 , serviceName:1}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}
// //geeting the service id(userselected)
// export function getServiceId(req, res) {
//   return Service.findOne({serviceCategory:req.body.serviceCategory}).exec()
//     .then(respondWithResult(res))
//     .catch(handleError(res));
// }

export function servDetails(req, res) {
  return Service.find({serviceName:req.body.serviceName}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function get(req, res) {
  return Service.find({})
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function add(req, res) {
 var use = jwt.decode(req.cookies.token);
  return Service.create({serviceName : req.body.serviceName,serviceCategory :req.body.serviceCategory, serviceDesc : req.body.serviceDesc, 
    active : true, communityId:use.communityId})
    .then(respondWithResult(res,201))
    .catch(handleError(res));
}

export function getServicesNames(req, res) {  //getting the servicenames (serviceprovider view)
  var use = jwt.decode(req.cookies.token);
  var serviceProviderId ;
      User.findOne({userId:use.userId})
       .then(function(data)
       {
           serviceProviderId = data.serviceProviderId;
           Community.findOne({communityName:req.body.communityName})
           .then(function(data)
           {
                 ServiceProviderDetail.aggregate([
                                {"$match":{serviceProviderId:serviceProviderId}},
                                {"$unwind":"$community"},
                                {"$match":{"community.communityId":data.communityId}}
                              ]).then(function(data)
                              {
                                   return Service.aggregate([
                                      {"$match": { serviceId: {'$eq':data[0].community.servicesNames}}}
                            
                                        ]) .then(respondWithResult(res))
                                           .catch(handleError(res));         
                              })

                                                    
           })
          
       })
}



// Gets a single Service from the DB
export function show(req, res) {
  return Service.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Service in the DB
export function create(req, res) {
  return Service.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Service in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Service.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Service from the DB
export function destroy(req, res) {
  return Service.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

// Thinking of using native mongod Test merge