/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/servProvRegists              ->  index
 * POST    /api/servProvRegists              ->  create
 * GET     /api/servProvRegists/:id          ->  show
 * PUT     /api/servProvRegists/:id          ->  upsert
 * PATCH   /api/servProvRegists/:id          ->  patch
 * DELETE  /api/servProvRegists/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import ServProvRegist from './servProvRegist.model';
import ServiceProviderDetail from '../serviceProviderDetail/serviceProviderDetail.model';
import Service from '../service/service.model';
import TypesForService from '../typesForService/typesForService.model';
import Community from '../community/community.model';
import User from '../user/user.model';
import jwt from 'jsonwebtoken';

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function (entity) {
        if (entity) {
            return res.status(statusCode).json(entity);
        }
        return null;
    };
}

function patchUpdates(patches) {
    return function (entity) {
        try {
            jsonpatch.apply(entity, patches, /*validate*/ true);
        } catch (err) {
            return Promise.reject(err);
        }

        return entity.save();
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




 //serviceprovider dashboard view
export function getReqCommunities(req, res) {
  var use = jwt.decode(req.cookies.token);
    ServiceProviderDetail.findOne({userId:use.userId})
    .then(function(data)
    {
        return ServProvRegist.aggregate([{"$match":{serviceProviderId:data.serviceProviderId}},
                                           {
                                       "$lookup": {
                                        from: "communities",
                                        localField: "communityId",
                                        foreignField: "communityId",
                                        as: "CommunityInfo"
                                     }}])
    })
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

//decline community names(serviceprovider view)
export function decCommName(req, res) {
    var use = jwt.decode(req.cookies.token);
    User.findOne({userId:use.userId})
    .then(function(data)
    { 
        return ServiceProviderDetail.aggregate([
          {"$match":{serviceProviderId:data.serviceProviderId,approvalStatus:"DECLINED"}},
          
           {
                "$lookup": {
                    from: "communities",
                    localField: "communityId",
                    foreignField: "communityId",
                    as: "CommunityInfo"
                }}

          ]) .then(handleEntityNotFound(res))
             .then(respondWithResult(res))
              .catch(handleError(res));
    })
}

//count Approve and decline Communities(serviceprovider view)
export function approveCommCount(req, res) {
    var use = jwt.decode(req.cookies.token);
    User.findOne({userId:use.userId})
    .then(function(data)
    { 
        return ServProvRegist.aggregate ([ { $match : { $or: [ { serviceProviderId: data.serviceProviderId,
                                                                 approvalStatus:"APPROVED" }, 
                                                               { serviceProviderId: data.serviceProviderId,
                                                                 approvalStatus:"DECLINED" },
                                                                  { serviceProviderId: data.serviceProviderId,
                                                                 approvalStatus:"PENDING" },                                                                 
                                                              ] }},
                                          { $group: { "_id": { status: "$approvalStatus"},
                                             count:{$sum:1}
                                          }}
                                         ]).then(handleEntityNotFound(res))
                                            .then(respondWithResult(res))
                                            .catch(handleError(res));
    })
}


// Gets a count of ServProvRegists to the admin
export function getCount(req, res) {
    var use = jwt.decode(req.cookies.token);
    return ServProvRegist.find({
            approvalStatus: "PENDING",
            communityId: use.communityId
        }).exec()
        // .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

//serviceProviserdetails
export function getDetails(req, res) {
    var use = jwt.decode(req.cookies.token);
    return ServProvRegist.aggregate([
            {
                $match: {
                    approvalStatus: "PENDING",
                    communityId: use.communityId
                }
  },
            {
                "$lookup": {
                    from: "serviceproviderdetails",
                    localField: "serviceProviderId",
                    foreignField: "serviceProviderId",
                    as: "totalServiceProvDetails"
                }

    }
 ]).exec()
        // return ServProvRegist.find({approvalStatus:"PENDING"})
        //  .then(function(data)
        //  {
        //     return ServProvRegist.aggregate([
        //                {"$lookup" : {
        //                      from: "serviceproviderdetails",
        //                      localField: "serviceProviderId",
        //                      foreignField: "serviceProviderId",
        //                      as: "totalServiceProvDetails"
        //                               }
        //                }]).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));


}
//getting the servicetypes based on the providerId,serviceCategory
// export function getsertypes(req, res) {
//      var use = jwt.decode(req.cookies.token);
//          return ServProvRegist.aggregate([
//        {"$match":{serviceProviderId:req.body.serviceProviderId,communityId:use.communityId}},
//         { "$unwind": "$types" },
//         {"$match":{"types.isApproved":true,"types.serviceCategoryId":req.body.serviceCategory}},
//         {"$lookup":{
//                   from:"typesforservices",
//                  localField:"types.typeId",
//                  foreignField:"typeId",
//                  as:"serviceTypeInfo"
//            }}
//          ]).exec()
//      .then(handleEntityNotFound(res))
//     .then(respondWithResult(res))
//     .catch(handleError(res));

// }



export function request(req, res) {   //request by serviceprovider
   var use = jwt.decode(req.cookies.token);
     User.findOne({userId:use.userId,role:"SERVICE_PROVIDER"})
     .then(function(data)
     { 

       return ServProvRegist.create({
                        serviceProviderId:data.serviceProviderId,
                        approvalRequestedTime:new Date(),
                        communityId:req.body.communityId,
                        approvalStatus:"PENDING"
           }).then(respondWithResult(res))
             .catch(handleError(res));
      })
}





// export function getsertypeApprovals(req, res) { //getting service type Approvals
//     var use = jwt.decode(req.cookies.token);
//     return ServProvRegist.aggregate([
//             {
//                 "$unwind": "$types"
//             },
//             {
//                 "$match": {
//                     "types.isApproved": false,
//                     communityId: use.communityId
//                 }
//             },
//             {
//                 "$lookup": { //geeting the servicetypedetails from servicetypemodel
//                     from: "typesforservices",
//                     localField: "types.typeId",
//                     foreignField: "typeId",
//                     as: "serviceTypeInfo"
//                 }
//             },
//             {
//                 "$lookup": { //getting the provider information
//                     from: "serviceproviderdetails",
//                     localField: "serviceProviderId",
//                     foreignField: "serviceProviderId",
//                     as: "serviceProviderInfo"
//                 }
//             },
//             {
//                 "$lookup": { //getting the service  information
//                     from: "services",
//                     localField: "types.serviceCategoryId",
//                     foreignField: "serviceId",
//                     as: "selectedServiceInfo"
//                 }
//             },
//             {
//                 "$group": {
//                     "_id": {
//                         serviceTypeInfo: "$serviceTypeInfo",
//                         types: "$types",
//                         serviceProviderInfo: "$serviceProviderInfo",
//                         selectedServiceInfo: "$selectedServiceInfo"
//                     }
//                 }
//             }
//     ])
//         .then(respondWithResult(res))
//         .catch(handleError(res));
// }


//approve the serviceprovider
export function approveSerProvider(req, res) {   
   var use = jwt.decode(req.cookies.token);
    ServProvRegist.update(
    {     //aprove the service provider
      serviceProviderId:req.body.serviceProviderId,serProRegistId:req.body.serProRegistId},
    {$set:{approvalRequestedTime:new Date(),approvalStatus:"APPROVED",communityId:use.communityId,
          // approvalComments:req.body.comments,
          approvedBy:use.firstName,
          approvedOn:new Date()
           }
    })
    .then(function(data)
    {
         ServiceProviderDetail.update({serviceProviderId:req.body.serviceProviderId},   //update with communityId
                              {$addToSet:{community:{communityId:use.communityId}}
                            }).then(function(data)
                            {
                              console.log(data);
                            })
      }).then(function(data){
        return ServProvRegist.find({})
       }).then(respondWithResult(res))
        .catch(handleError(res));
           
    
  }

//decline the serviceProvider
export function declineSerProvider(req, res) {
    var use = jwt.decode(req.cookies.token);
    return ServProvRegist.update({
            serviceProviderId: req.body.serviceProviderId,
            communityId: use.communityId
        }, {
            $set: {
                approvalStatus: "DECLINED",
                approvalComments: req.body.comments

            }
        }).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

//approve the servicetype and update the services in serviceproviderdetails
  // export function serviceTypeApp(req, res) {
  //    var use = jwt.decode(req.cookies.token);
  //    ServProvRegist.update({ serviceProviderId:req.body.serviceProviderId ,communityId:use.communityId,
  //                                       types: { $elemMatch: { typeId: req.body.typeId } }},
  //                                      { $set: { "types.$.isApproved" : "true" } })
  //     .then(function(data)
  //           { 
  //                 Service.findOne({serviceCategory:req.body.serviceCategory})
  //                 .then(function(data)
  //                 {
  //                    return ServiceProviderDetail.update({serviceProviderId:req.body.serviceProviderId,
  //                                                community:{
  //                                                 "$elemMatch":{communityId:use.communityId}}},
  //                                                {"$addToSet":{
  //                                                     "community.$.servicesNames":data.serviceId}}
  //                                                ).then(respondWithResult(res))
  //                                                  .catch(handleError(res));  

  //                 })                 
  //           }) 
               
  //       }  


//decline the service type
// export function declineServiceType(req, res) {
//     var use = jwt.decode(req.cookies.token);
//     return ServProvRegist.update({
//             serviceProviderId: req.body.serviceProviderId,
//             communityId: use.communityId,
//             types: {
//                 $elemMatch: {
//                     typeId: req.body.typeId
//                 }
//             }
//         }, {
//             $set: {
//                 "types.$.isApproved": "false"
//             }
//         })
//         .then(respondWithResult(res))
//         .catch(handleError(res));
// }

// Gets a single ServProvRegist from the DB
export function show(req, res) {
    return ServProvRegist.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new ServProvRegist in the DB
export function create(req, res) {
    return ServProvRegist.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Upserts the given ServProvRegist in the DB at the specified ID
export function upsert(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    return ServProvRegist.findOneAndUpdate({
        _id: req.params.id
    }, req.body, {
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true
    }).exec()

    .then(respondWithResult(res))
        .catch(handleError(res));
}

// Updates an existing ServProvRegist in the DB
export function patch(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    return ServProvRegist.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a ServProvRegist from the DB
export function destroy(req, res) {
    return ServProvRegist.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}