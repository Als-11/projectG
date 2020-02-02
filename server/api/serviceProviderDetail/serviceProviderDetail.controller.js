/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/serviceProviderDetails              ->  index
 * POST    /api/serviceProviderDetails              ->  create
 * GET     /api/serviceProviderDetails/:id          ->  show
 * PUT     /api/serviceProviderDetails/:id          ->  upsert
 * PATCH   /api/serviceProviderDetails/:id          ->  patch
 * DELETE  /api/serviceProviderDetails/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import ServiceProviderDetail from './serviceProviderDetail.model';
import  ServProvRegist from '../servProvRegist/servProvRegist.model';
import Service from '../service/service.model';
import Community from '../community/community.model';
import  help from 'sendgrid';
import pwdgen from 'password-generator';
import User from '../user/user.model';
import jwt from 'jsonwebtoken';
var helper = help.mail;
var generatePassword = require('password-generator');

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

// Gets a list of ServiceProviderDetails
export function index(req, res) {
  return ServiceProviderDetail.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// find Service Provider for communities 
export function getcommunities(req, res) {
   var use = jwt.decode(req.cookies.token);
   User.findOne({userId: use.userId,role:"SERVICE_PROVIDER"})
  .then(function(data) {
     return ServiceProviderDetail.aggregate([
       {"$match":{serviceProviderId:data.serviceProviderId}},
       {"$unwind":"$community"},
       {"$lookup":{
            from:"communities",
            localField:"community.communityId",
            foreignField:"communityId",
            as:"TotalCommunityInfo"
       }}
       ]) .then(respondWithResult(res))
         .catch(handleError(res));
  })
}



//Approve community names(serviceprovider view)
export function appCommName(req, res) {
    var use = jwt.decode(req.cookies.token);
    User.findOne({userId:use.userId})
    .then(function(data)
    { 
        return ServiceProviderDetail.aggregate([
          {"$match":{serviceProviderId:data.serviceProviderId}},
          {
                        "$unwind": "$community"
                    },
           {
                "$lookup": {
                    from: "communities",
                    localField: "community.communityId",
                    foreignField: "communityId",
                    as: "CommunityInfo"
                }}

          ]) .then(handleEntityNotFound(res))
             .then(respondWithResult(res))
              .catch(handleError(res));
    })
}




//geeting the serviceCategories
export function getServicesCat(req, res) {
  var password = generatePassword(8, false);
  return ServiceProviderDetail.findOne({serviceProviderId:req.body.serviceProviderId},{services:1}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function anothermethod(req, res) {
   ServiceProviderDetail.find({emailId:req.body.email})
    .then(function(data)
    { 
      console.log(data);
       var serviceProviderId = data[0].serviceProviderId;
       console.log(serviceProviderId);
        Service.find({})
          .then(function(data)
            {
            for(var i=0;i<data.length;i++){
              ServiceProviderDetail.update({serviceProviderId:serviceProviderId},
             {$addToSet:{brands:{serviceCategory:data[i].serviceCategory}}
           }).then(function(data)
           {
            console.log(data);
           })
           }
         })
    }) .then(respondWithResult(res))
       .catch(handleError(res));
   
}

export function create(req, res) {
   var password = generatePassword(8, false);
   ServiceProviderDetail.create({firstName:req.body.firstName,
    lastName:req.body.lastName,
    companyName:req.body.companyName,
     address:req.body.address,
     landlineNumber:req.body.landlineNumber,
     mobileNumber:req.body.phoneNumber,
      emailId:req.body.emailId,
     companyInfo:req.body.companyInfo
   })
    .then(function(data){
            User.create ({
                                      firstName:data.firstName,
                                      lastName:data.lastName,
                                      email:data.emailId,
                                      password:password,
                                      serviceProviderId:data.serviceProviderId,
                                      role:'SERVICE_PROVIDER',
                                      imageUrl:req.body.imageUrl,
                                      lockUntil:0
                                })
           .then(function(data)
           {

           	   console.log(data);
                ServiceProviderDetail.update({serviceProviderId:data.serviceProviderId},
                                             {$set:{userId:data.userId}
                                          }).then(function(data)
                                          {
                                          	console.log(data);
                                          })
           })
           .then(function(data){
           	console.log(data);
           	return User.findOne({email:req.body.emailId})
           }).then(respondCommunityWithResult(res,password, 201))
             .catch(handleError(res));
    })
    
}

function respondCommunityWithResult(res, password, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
  	console.log(entity);
    if (entity) {
      res.status(statusCode).json(entity);
      mail(entity.email, password);
    }
  };
}

export function mail(emailId, password){
 console.log("hiii");
 console.log(emailId);
 console.log(password);
  var helper = require('sendgrid').mail;
  var from_email = new helper.Email("noreply@guwha.com");
  var to_email = new helper.Email(emailId);
  var subject = "Welcome to Guwha Community";
  var bodyContent = "Hi, \n Welcome to Guwha \n Your username : " + emailId + " \n Password : " + password + "\nRegards,\nGuwha";
  var content = new helper.Content("text/plain", bodyContent);
  var mail = new helper.Mail(from_email, subject, to_email, content);

  var sg = require('sendgrid').SendGrid('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');
  var requestBody = mail.toJSON()
  var request = sg.emptyRequest()
  request.method = 'POST'
  request.path = '/v3/mail/send'
  request.body = requestBody
  sg.API(request, function (response) { 
  })
    
}


 export function getServicesNames(req, res) {  //getting the servicenames (serviceprovider view)
  var use = jwt.decode(req.cookies.token);
  var serviceProviderId ;
      User.findOne({userId:use.userId})
       .then(function(data)
       {
           serviceProviderId = data.serviceProviderId;
           Community.findOne({communityName:req.body.communityName,"address.address1":req.body.address1,"address.locality":req.body.locality})
           .then(function(data)
           {
                 ServiceProviderDetail.aggregate([
                                {"$match":{serviceProviderId:serviceProviderId}},
                                {"$unwind":"$brands"},
                            {"$match":{"brands.brandId":{$gt: 0}}}
                        ]) .then(respondWithResult(res))
                           .catch(handleError(res));                                                 
           })
          
       })
}

export function serviceName(req, res) {  //getting the servicenames and provider count(users services view)
  var use = jwt.decode(req.cookies.token);
  return ServiceProviderDetail.aggregate([
    {"$unwind":"$community"},
    {"$match":{"community.communityId":use.communityId}},
    {"$unwind":"$brands"},
    // {"$lookup":{
    //      from: "services",
    //                 localField: "community.servicesNames",
    //                 foreignField: "serviceId",
    //                 as: "totalServiceProvDetails"
    //     }},
    {"$group":{"_id":{"serviceId":"$brands.serviceCategory"},
    count:{"$sum":1}}}
    ]).then(respondWithResult(res))
    .catch(handleError(res));
}

// export function orders(req,res)   //orders shown to the serviceprovider
// {
// var use =  jwt.decode(req.cookies.token);
// var date = new Date()
// var from = date.getDate()+1;
// var fromdate = new Date();
//  fromdate.setDate(from);
//   return  ServiceProviderDetail.aggregate([
//   {"$match":{"userId":use.userId}},
//   {"$unwind":"$community"},
//    {"$lookup":{
//     from:"communities",
//     localField:"community.communityId",
//     foreignField:"communityId",
//     as:"communityInfo"
//     }},
//     {"$lookup":{
//     from:"servicerequests",
//     localField:"serviceProviderId",
//     foreignField:"serviceProviderId",
//     as:"servicesInfo"
//     }},
//     {"$unwind":"$servicesInfo"},
//      { "$match":{"$and":[{"servicesInfo.deliveryDate":{$lte:fromdate}},
//                        {"servicesInfo.deliveryDate":{$gte:date}},
//                        ]}},
//   // {"$match":{"servicesInfo.deliveryDate":date}},
//     {"$group":{"_id":{servicename:"$servicesInfo.serviceTypeName",communityInfo:"$communityInfo",deliveryDate:"$servicesInfo.deliveryDate"},
//      count:{"$sum":1}}} 
// ]).then(respondWithResult(res))
//     .catch(handleError(res))

// }

export function serviceproviderDetail(req, res) {  //getting the serviceproviderdetails
  var use = jwt.decode(req.cookies.token);
  return ServiceProviderDetail.aggregate([
      {"$unwind":"$community"},
        {"$match":{"community.communityId":use.communityId}},
         {"$unwind":"$brands"},
          {"$match":{"brands.serviceCategory":req.body.serviceId,"brands.brandId":{$gt: 0}}},
          // {"$unwind":"$brands.brandId"} ,
          // {"$lookup":{
          //      from: "typesforservices",
          //           localField: "brands.brandId",
          //           foreignField: "typeId",
          //           as: "totalBrands"
          // }},
      {"$group":{"_id":{"serviceProviders":"$companyName","serviceProviderId":"$serviceProviderId","address":"$address",
                        "landlineNumber":"$landlineNumber","mobileNumber":"$mobileNumber","firstName":"$firstName","lastName":"$lastName",
                         "ToTalBrands":"$totalBrands"}}}
    ]).then(respondWithResult(res))
     .catch(handleError(res));
    }


    export function getSelectedBrands(req, res) {  //getting the serviceproviderdetails
  var use = jwt.decode(req.cookies.token);
  return ServiceProviderDetail.aggregate([
  {"$match":{"serviceProviderId":req.body.serviceProviderId}},
      {"$unwind":"$community"},
        {"$match":{"community.communityId":use.communityId}},
         {"$unwind":"$brands"},
          {"$match":{"brands.serviceCategory":req.body.serviceCategory,"brands.brandId":{$gt: 0}}},
          {"$unwind":"$brands.brandId"} ,
          {"$lookup":{
               from: "typesforservices",
                    localField: "brands.brandId",
                    foreignField: "typeId",
                    as: "totalBrands"
          }},
      {"$group":{"_id":{"ToTalBrands":"$totalBrands"}}}
    ]).then(respondWithResult(res))
     .catch(handleError(res));
    }


    //getting the servicetypes based on the community,serviceCategory(providerview)
export function getserviceTypes(req, res) {
var use = jwt.decode(req.cookies.token);
var communityId;
var serviceProviderId;
  User.findOne({userId:use.userId})
  .then(function(data)
  {
      serviceProviderId = data.serviceProviderId;
     return ServiceProviderDetail.aggregate([
    {"$match":{"serviceProviderId":serviceProviderId}},
         {"$unwind":"$brands"},
          {"$match":{"brands.serviceCategory":req.body.serviceCategory,"brands.brandId":{$gt: 0}}},
          {"$unwind":"$brands.brandId"} ,
          {"$lookup":{
               from: "typesforservices",
                    localField: "brands.brandId",
                    foreignField: "typeId",
                    as: "totalBrands"
          }},
      {"$group":{"_id":{"ToTalBrands":"$totalBrands"}}}
    ]).then(respondWithResult(res))
     .catch(handleError(res));
    })
    
}

    

    export function getServiceProviders(req, res) {  //getting the serviceproviderdetails
  var use = jwt.decode(req.cookies.token);
  return ServiceProviderDetail.aggregate([
      {"$unwind":"$community"},
        {"$match":{"community.communityId":use.communityId}}
    ]).then(respondWithResult(res))
     .catch(handleError(res));
    }


export function names(req, res) {  //getting the serviceproviderdetails
  var use = jwt.decode(req.cookies.token);
  return ServiceProviderDetail.aggregate([
      {"$unwind":"$community"},
        {"$match":{"community.communityId":use.communityId}},
         {"$unwind":"$community.servicesNames"},
          {"$match":{"community.servicesNames":req.body.serviceId}} 
    ]).then(respondWithResult(res))
     .catch(handleError(res));
    }

export function serviceProviderProfile(req, res){ //getting service provider details for profile page
   var use = jwt.decode(req.cookies.token);
   User.find({userId:use.userId}).exec()
   .then(function(data){
    console.log(data[0].serviceProviderId);
    return ServiceProviderDetail.aggregate([
       {"$match":{serviceProviderId:data[0].serviceProviderId}},
       {"$lookup":{
                    from:"users",
                    localField:"userId",
                    foreignField:"userId",
                    as:"userinfo"
                  }
                  }
       ]) 
   }).then(respondWithResult(res))
     .catch(handleError(res));
} 




// Upserts the given ServiceProviderDetail in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return ServiceProviderDetail.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing ServiceProviderDetail in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return ServiceProviderDetail.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a ServiceProviderDetail from the DB
export function destroy(req, res) {
  return ServiceProviderDetail.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
