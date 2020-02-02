/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/community              ->  index
 * POST    /api/community              ->  create
 * GET     /api/community/:id          ->  show
 * PUT     /api/community/:id          ->  update
 * DELETE  /api/community/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import validator from 'validator';
import pwdgen from 'password-generator';
import Community from './community.model';
import User from '../user/user.model';
import  help from 'sendgrid';
import ServiceProviderDetail from '../serviceProviderDetail/serviceProviderDetail.model';
import ServProvRegist from '../servProvRegist/servProvRegist.model';
import Floors from '../floors/floors.model';
import jwt from 'jsonwebtoken';
import http from 'http';
var helper = help.mail;
var generatePassword = require('password-generator');

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


export function communitiesInfo(req, res) {    //list of communities(serviceprovider dashboard view)
  var use = jwt.decode(req.cookies.token);
  var existingCommunities =[];
   var  serviceProviderId;
   ServiceProviderDetail.findOne({userId:use.userId})
   .then(function(data)
   {

       console.log(data);
       ServProvRegist.find({serviceProviderId:data.serviceProviderId})
       .then(function(data)
       {
            console.log(data);
            if(data.length == 0)
        {
            
            Community.find({})
            .then(respondWithResult(res))
                 .catch(handleError(res));
        }
        else{
               for(var i=0;i<data.length;i++){
                     existingCommunities.push(data[i].communityId)
               }
            }
            console.log(existingCommunities); 
            return Community.aggregate([
                {"$match": { 'communityId': {'$nin':existingCommunities}}},
               // {"$lookup":{
               //    from:"serviceprovregists",
               //   localField:"communityId",
               //   foreignField:"communityId",
               //   as:"serviceinfo"
               //  }}
               ]) 
            .then(respondWithResult(res))
             .catch(handleError(res));
        
       })
          
    })

  }

//Getting residents of Selected Block
  export function populateResident(req, res) {
    var use = jwt.decode(req.cookies.token);
    User.find({communityId:use.communityId, role:"RESIDENT", blockName:req.body.blockName}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res)); 
  }

  // Gets a lat and long values for  Communitys
export function getLatLong(req, res) {
  var use = jwt.decode(req.cookies.token);
   Community.findOne({communityId:use.communityId})
   .then(respondWithResult(res))
    .catch(handleError(res));        
}


  // chnage a lat and long values for  Communitys(admin)
export function changeLatLong(req, res) {
  var use = jwt.decode(req.cookies.token);
   Community.update({communityId:use.communityId},{"$set":{latValue:req.body.latValue,longValue:req.body.longValue}})
   .then(respondWithResult(res))
    .catch(handleError(res));        
}

// Gets a list of Communitys
export function index(req, res) {
  return Community.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}
//superadmin
export function getCommunityInfo(req, res) {
  return Community.aggregate([{"$match":{}},
 {"$lookup":{
                  from:"users",
                 localField:"communityId",
                 foreignField:"communityId",
                 as:"sai"
           }}
           
              
    
           ])
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function getusersCount(req,res) {
  return User.count({communityId:req.body.communityId,role:"RESIDENT"}).exec()
  .then(handleEntityNotFound(res))
  .then(respondWithResult(res))
  .catch(handleError(res));
}

// Gets a single Community from the DB
export function show(req, res) {
  return Community.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Community in the DB
export function create(req, res) { 
   if(!validator.isEmail(req.body.emailId)){
       res.status(400).send("Email is bad");
       return;
   }    
   if(!validator.isNumeric(req.body.phoneNumber)){
       res.status(400).send("Phone number is bad");
       return;
   }    
  var docs = []; 
  return Community.create(req.body)
    .then(function(community){
      var result = [];
      if(req.body.password!=null){
         var password = req.body.password;
      }
      else{
      var password = generatePassword(8, false);
          }
      docs.push(community);
      return User.create({email: req.body.emailId,
                          firstName: req.body.firstName,
                          phoneNumber: req.body.phoneNumber, 
                          communityId: community.communityId, 
                          password: password,
                          Gender:req.body.gender,
                          imageUrl:req.body.imageUrl,
                          role: 'COMMUNITY_ADMIN',
                          lockUntil:0
                        })
        .then(respondCommunityWithResult(res, password, 201))
        .catch(handleTransactionError(res, docs));
    })
    .catch(handleTransactionError(res, docs));
} 

function handleTransactionError(res, docs, statusCode) {
    statusCode = statusCode || 500; 
    return function (err) {
        for (var i = 0; i < docs.length; i++) {
            docs[i].remove(onRemove);
        }
        res.status(statusCode).send(err);
    };
}

function onRemove(err, doc) { 
}

function createUserWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
      mail(entity.emailId);
    }
  };
}

function respondCommunityWithResult(res, password, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
      mail(entity.email, password);
    }
  };
}
//search box 
export function getSuggestions(req,res)
{
  var key = (req.body.keyword);
  return Community.find({"communityName" : { $regex : new RegExp("^"+key,"i")}}).exec()  //ignoring the case
  .then(handleEntityNotFound(res))
  .then(respondWithResult(res))
  .catch(handleError(res));
}

//Here we get security level
export function setSecurityLevel(req, res) {
  var use = jwt.decode(req.cookies.token); 
  return Community.update({communityId:use.communityId},
                        {$set:{securityLevel: req.body.securityLevel}}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Community in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Community.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Community from the DB
export function destroy(req, res) {
  return Community.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

//update the community with the details of maintenanceInfo
export function maintenanceInfo(req,res) {
  var use = jwt.decode(req.cookies.token);    
    return Community.update(
    {communityId : use.communityId},
    {$set : { maintenanceCost : req.body.maintenanceCost,maintenanceDate:req.body.maintenanceDate}},
    {safe : true,new:true}).exec()
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}


export function addBlock(req,res) {
  var use = jwt.decode(req.cookies.token);    
    return Community.findOneAndUpdate(
    {communityId : use.communityId},
    {$push : { blocks :  req.body.blocks}},
    {safe : true, upsert:true, new:true})
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

export function deleteBlock(req,res){
  var use = jwt.decode(req.cookies.token);
  Community.update(
    {"communityId":use.communityId },
    {$pull :  { "blocks": { "blockName" : { $in  :  req.query.blockNames }  } } },
    {safe:true}
  )
  .then(handleEntityNotFound(res))
  .then(respondWithResult(res))
  .catch(handleError(res));
}

export function getBlocks(req,res){ 
  var use = jwt.decode(req.cookies.token); 
    return Community.findOne({communityId:use.communityId}).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

export function getSelectedBlocks(req,res){
    return Community.findOne({communityName:req.body.communityName,"address.address1":req.body.address1,"address.locality":req.body.locality}).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}
    
export function addFloors(req,res){
  var use = jwt.decode(req.cookies.token);
  Community.findOne({communityId:use.communityId})
  .then(function(data)
  {
    if(data.maintenanceCost == 0 && data.maintenanceDate == 0){
      var maintenanceCost = 0;
      var maintenanceDate = 0;
    }
    else{
       var maintenanceCost = data.maintenanceCost;
      var maintenanceDate = data.maintenanceDate;
    }

     for(var i=0;i<req.body.flatNumbers.length;i++ ){
      Floors.create({
                             communityId:use.communityId,
                             blockName:req.body.blockName,
                             houseNumber:req.body.blockName+'-'+req.body.flatNumbers[i],
                             floorNumber:req.body.floorNumber,
                             flatNumber:req.body.flatNumbers[i],
                              maintenanceCost:data.maintenanceCost,
                              maintenanceDate :data.maintenanceDate,
                              flatType:'Not Selected'
                           })
    }
  }).then(function(data)
  {
    return Community.findOne({communityId:use.communityId})
  }).then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));

}
  
// Community.update( 
//        { "communityId":use.communityId,
//         "blocks.blockName":req.body.blockName}
//         {$addToSet : {"blocks.$.floors" : { $each : req.body.floors }   
// }}).then(respondWithResult(res,200))
//     .catch(handleError(res));

export function deleteFloors(req,res){
  var use = jwt.decode(req.cookies.token);
Community.update(
    {communityId: use.communityId,"blocks.blockName":req.query.blockName},
    {$pull:{ "blocks.$.floors": { "floorNumber" :{ $in : req.query.floors }}}}, 
    {safe:true})
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

    
export function mail(emailId, password){

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
