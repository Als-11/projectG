/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/typesForServices              ->  index
 * POST    /api/typesForServices              ->  create
 * GET     /api/typesForServices/:id          ->  show
 * PUT     /api/typesForServices/:id          ->  upsert
 * PATCH   /api/typesForServices/:id          ->  patch
 * DELETE  /api/typesForServices/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import jwt from 'jsonwebtoken';
import TypesForService from './typesForService.model';
import User from '../user/user.model';
import ServProvRegist from '../servProvRegist/servProvRegist.model';
import ServiceProviderDetail from '../serviceProviderDetail/serviceProviderDetail.model';
import Service from '../service/service.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
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

// Gets a list of TypesForServices
export function save(req, res) {
 var use = jwt.decode(req.cookies.token);
 console.log(use.userId);
var costs = req.body.costs;
var qunatity = req.body.quantity;
var services = req.body.serviceCategoryArray
  return User.findOne({userId:use.userId})
 .then(function(data)
 {
     for(var i=0;i<services.length;i++){
       TypesForService.create({
                            serviceProviderId:data.serviceProviderId,
                            brandName:req.body.name,
                             unitPrice:costs[i],
                            quantity:req.body.quantity[i],
                            isActive:"TRUE",
                            serviceName:services[i]
                }).then(function(data)
                {
                       ServiceProviderDetail.update({userId:use.userId, 
                         brands:{
                                 "$elemMatch":{serviceCategory:data.serviceName
                                 }}},
                                 {"$addToSet":{
                                               "brands.$.brandId":data.typeId}}
                                ).then(function(data,err){
                        if(data){
                        console.log(data)}
                        else{
                          console.log(err)
                        }
                    })


                    // ServiceProviderDetail.update({userId:use.userId},
                    //         {"$push":{"brands":{"serviceCategory":data.serviceName}}}
                    //         ).then(function(data)
                    //         {
                    //            console.log(services[i]);
                    //            console.log(data);
                    //           ServiceProviderDetail.update({userId:use.userId, 
                    //             brands:{ "$elemMatch":{serviceCategory:services[i]}}},
                    //              {"$addToSet":{"brands.$.brandId":111}})
                    //         })


  //                            community:{
  // //                                                 "$elemMatch":{communityId:use.communityId}}},
  //                                                {"$addToSet":{
  //                                                     "community.$.servicesNames":data.serviceId}}
                    // ServiceProviderDetail.update({"userId":use.userId},
                    //      {"$push":{"brands":{"brandId":data.typeId,"serviceCategory":data.serviceName}}
                    //    }).then(function(data,err){
                    //     if(data){
                    //     console.log(data)}
                    //     else{
                    //       console.log(err)
                    //     }
                    //    })
                })

    }
    return User.findOne({userId:use.userId})  //by geetting the response to client side
    .then(respondWithResult(res))
    .catch(handleError(res));
 }) 
 
}


// Gets a userselectedTypeService Info
// Gets a userselectedTypeService Info
export function userSelSertype(req, res) {
    return TypesForService.find({brandName:req.body.name,serviceProviderId:req.body.serviceProviderId,
                                  serviceName:req.body.serviceId,quantity:req.body.quantity},
                                 {unitPrice:1,typeId:1}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
  
}

// Gets a single TypesForService from the DB
export function getBrand(req, res) {
 var use = jwt.decode(req.cookies.token);
  User.findOne({userId:use.userId})
 .then(function(data)
 {
    return TypesForService.aggregate([
      {"$match":{serviceProviderId:data.serviceProviderId}},
      {
                "$lookup": {
                    from: "serviceproviderdetails",
                    localField: "serviceProviderId",
                    foreignField: "serviceProviderId",
                    as: "totalServiceProvDetails"
      }},
      {"$group":{"_id":{serviceName:"$serviceName",brandName:"$brandName",
                      serviceProviderdetails:"$totalServiceProvDetails"}}}
      ])

       .then(respondWithResult(res, 201))
    .catch(handleError(res));
  })
}


export function getBrandCount(req, res) {
 var use = jwt.decode(req.cookies.token);
  User.findOne({userId:use.userId})
 .then(function(data)
 {
    return TypesForService.count({serviceProviderId:data.serviceProviderId})
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
})
}
// Creates a new TypesForService in the DB
export function create(req, res) {
  return TypesForService.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given TypesForService in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return TypesForService.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing TypesForService in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return TypesForService.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a TypesForService from the DB
export function destroy(req, res) {
  return TypesForService.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
