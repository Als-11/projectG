/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/serviceRequests              ->  index
 * POST    /api/serviceRequests              ->  create
 * GET     /api/serviceRequests/:id          ->  show
 * PUT     /api/serviceRequests/:id          ->  upsert
 * PATCH   /api/serviceRequests/:id          ->  patch
 * DELETE  /api/serviceRequests/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import ServiceRequest from './serviceRequest.model';
import jwt from 'jsonwebtoken';
import Service from '../service/service.model';
import ServiceProviderDetail from '../serviceProviderDetail/serviceProviderDetail.model';
import User from '../user/user.model';

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

// Gets a list of ServiceRequests
export function index(req, res) {
  return ServiceRequest.find().exec() 
    .then(respondWithResult(res)) 
    .catch(handleError(res));
}

// Gets a list of ServiceRequests
export function selectDayService(req, res) {
   var use = jwt.decode(req.cookies.token);
  var date = new Date(req.body.day);
     var from = date.getDate()-1;
     var month = date.getMonth();
     var year = date.getFullYear();
     var fromdate = new Date();
     fromdate.setDate(from);
     fromdate.setMonth(month);
     fromdate.setYear(year);
  return ServiceRequest.aggregate([
     {
        "$match":{"$and":[{"consumerUserId":use.userId,"deliveryDate":{$lte:date}},
                       {"consumerUserId":use.userId,"deliveryDate":{$gte:fromdate}}
                       ]}}   
     ])
    .then(respondWithResult(res)) 
    .catch(handleError(res));
}

export function updateService(req, res) {
  return ServiceRequest.update({servRequestId:req.body.serviceRequestId},{"$set":{units:req.body.units}})
   .then(respondWithResult(res))
    .catch(handleError(res));
}
export function deleteService(req, res) {
  return ServiceRequest.remove({servRequestId:req.body.serviceRequestId})
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function additonalService(req, res) {
 var use = jwt.decode(req.cookies.token);
   User.findOne({userId:use.userId,communityId:use.communityId})
  .then(function(data)
  {
     var FlatNumber = data.houseNumber;
     var blockName = FlatNumber.split('-');
     ServiceRequest.create({
                                     servicecategory:req.body.servicecategory,
                                     communityId:use.communityId,
                                     serviceProviderId:req.body.serviceProviderId,
                                     units:req.body.units,
                                     consumerUserId:use.userId,
                                     consumerBlock:blockName[0],
                                     consumerFloor:blockName[1],
                                     deliveryDate:req.body.deliveryDate,
                                     price:req.body.totalCost,
                                     customTypeId:req.body.customTypeId,
                                     status:"PENDING",
                                     serviceTypeName:req.body.serviceTypeName

                           })
 }).then(function(data)
  {
    return ServiceRequest.find({})
  }).then(respondWithResult(res))
    .catch(handleError(res));
            
}
  


//user view(list of adapt services)
 export function listServices(req, res) {
      var use = jwt.decode(req.cookies.token);
     return ServiceRequest.aggregate([
     {"$match":{communityId:use.communityId,consumerUserId:use.userId}},
     {"$group":{"_id":{"serviceCategory":"$servicecategory"}}},
       ]) 
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

//day by day services(calender view)
export function dayByDayServices(req, res) {
      var use = jwt.decode(req.cookies.token);
    return ServiceRequest.aggregate([  
  {"$match":{"consumerUserId":use.userId}},
{"$project":{ "deliveryDate": 1,"units":1,"customTypeId":1,serviceTypeName:1,
           "month": { "$month": "$deliveryDate" },"year": { "$year": "$deliveryDate" }}},
     
   {"$match":{month:req.body.month,year:req.body.year}},      
           
      {
        $group : {
           _id : {  day: { $dayOfMonth: "$deliveryDate" }
                  },
           services: { $push:   "$$ROOT"   }
        }
      }
   ]
).then(respondWithResult(res))
    .catch(handleError(res));
  }
//      return ServiceRequest.aggregate([
//             {
//         "$match":{"consumerUserId":use.userId}                 
//      },                                 
//     { "$project": {
//         "deliveryDate": 1,"units":1,"customTypeId":1,
//         "month": { "$month": "$deliveryDate" }
//     }}, 
//     {"$match": {month: req.body.month}},
//     {"$lookup":{
//                   from:"servicerequests",
//                  localField:"deliveryDate",
//                  foreignField:"deliveryDate",
//                  as:"sai"
//            }},

//      {"$lookup":{
//                   from:"typesforservices",
//                  localField:"customTypeId",
//                  foreignField:"typeId",
//                  as:"serviceTypeInfo"
//            }},
//     {
//         "$group" : {
//            _id : { "month": "$month",sai:"$sai",serviceTypeInfo:"$serviceTypeInfo","deliveryDate":"$deliveryDate","unit":"$units"},
//          "data": {
//       "$push": "$$ROOT"
//     }}}  
// ])
//   .then(function(data){     
//   })
// }


export function downArrow(req,res)   //downArroworders shown to the serviceprovider
{
var use =  jwt.decode(req.cookies.token);
ServiceProviderDetail.findOne({userId:use.userId})
.then(function(data)
{
    var date = new Date(req.body.date)
  // var from = date.getDate()+1;
  var fromdate = new Date(req.body.fromDate);
   // fromdate.setDate(from);
  return  ServiceRequest.aggregate([
  {"$match":{"serviceProviderId":data.serviceProviderId}},
   {"$lookup":{
    from:"communities",
    localField:"communityId",
    foreignField:"communityId",
    as:"communityInfo"
    }},
     { "$match":{"$and":[{"deliveryDate":{$lte:fromdate}},
                       {"deliveryDate":{$gt:date}},
                       ]}},
  // {"$match":{"servicesInfo.deliveryDate":date}},
    {"$group":{"_id":{servicename:"$serviceTypeName",communityInfo:"$communityInfo",deliveryDate:"$deliveryDate",status:"$status"},
    count: { 
            $sum: "$units" 
        } }} 
]).then(respondWithResult(res))
  .catch(handleError(res))
})

}

export function inProcessingRequest(req,res)   //inprocessing Request
{
  var use =  jwt.decode(req.cookies.token);
  var status = req.body.status;
  if(status == 1){
    var newStatus = 'ACCECPTED';
  }
  else{
     var newStatus = 'DELIVERED';
  }
  var date = new Date(req.body.date)
  date.setHours(0,0,0,0)
   ServiceRequest.find({communityId:req.body.communityId,deliveryDate:date})
   .then(function(data)
   {
        for(var i=0;i<data.length;i++){
           ServiceRequest.update({communityId:data[i].communityId,servRequestId:data[i].servRequestId,
                                  consumerUserId:data[i].consumerUserId,deliveryDate:date},
                                  {$set:{status:newStatus}})
           .then(function(data)
           {
            console.log(data);
           })
        }
   })
   .then(function(data)
  {
    return ServiceRequest.find({communityId:req.body.communityId})
  }).then(respondWithResult(res))
    .catch(handleError(res));
}



export function getAllOrdersCommunity(req,res)   
{
  var use =  jwt.decode(req.cookies.token);
  var fromdate = new Date(req.body.date);
  var getDate = fromdate.getDate();
 var getMonth = fromdate.getMonth();
  var date =new Date();
  date.setDate(getDate-1);
  date.setMonth(getMonth);
  return ServiceRequest.aggregate([ { "$match":{"$and":[{communityId:req.body.communityId,"deliveryDate":{$gt:date}},
                       {communityId:req.body.communityId,"deliveryDate":{$lte:fromdate}}]}},
                      {
                "$lookup": {
                    from: "users",
                    localField: "consumerUserId",
                    foreignField: "userId",
                    as: "userDetails"
            }},
            {
            "$lookup": {
                    from: "communities",
                    localField: "communityId",
                    foreignField: "communityId",
                    as: "communityInfo"
            }},

            {
                "$lookup": {
                    from: "serviceproviderdetails",
                    localField: "serviceProviderId",
                    foreignField: "serviceProviderId",
                    as: "serviceproviderDetails"
            }},
            {"$group":{"_id":{userid:"$consumerUserId",userDetails:"$userDetails",servicename:"$serviceTypeName",
                              ServiceProviderDetail:"$serviceproviderDetails",communityDetails:"$communityInfo"},
                            count: { 
            $sum: "$units" 
        } }} 
             ])
  .then(respondWithResult(res))
  .catch(handleError(res));
}

// Gets a list of ServiceRequests 
export function deleteServices(req, res) {
   var use = jwt.decode(req.cookies.token);
   var date= new Date(req.body.enddate)
   date.setHours(0,0,0,0);
   var frmdate = new Date(req.body.fromdate)
   frmdate.setHours(0,0,0,0);
    ServiceRequest.aggregate([  
     {
        "$match":{"$and":[{"consumerUserId":use.userId,"deliveryDate":{$lte:date}},
                         {"consumerUserId":use.userId,"deliveryDate":{$gte:frmdate}}
                       ]}}
     ])
    .then(respondWithResult(res))
    .catch(handleError(res));   
}


// Creates a new ServiceRequest in the DB
export function userServices(req, res) {
	  var use = jwt.decode(req.cookies.token);
    var dateSet;
	 User.findOne({userId:use.userId,communityId:use.communityId})
	.then(function(data)
	{
		 var FlatNumber = data.houseNumber;
		 var blockName = FlatNumber.split('-');
     var fromDate = new Date(req.body.fromDate);
       dateSet = fromDate.getDate();
     for(var i=0;i<req.body.deliveryDays;i++) {
           var date = fromDate.setDate(dateSet+i); 
           var deliveryDate = new Date(date);
             deliveryDate.setHours(0,0,0,0);
		 	      ServiceRequest.create({
		 	                               communityId:use.communityId,
                                     servicecategory:req.body.serviceCategory,
		 	                               serviceProviderId:req.body.serviceProviderId,
		 	                               units:req.body.units,
		 	                               consumerUserId:use.userId,
		 	                               consumerBlock:blockName[0],
		 	                               consumerFloor:blockName[1],
		 	                               deliveryDate:deliveryDate,
		 	                               price:req.body.totalCost,
		 	                               customTypeId:req.body.customTypeId,
		 	                               status:"PENDING",
                                     serviceTypeName:req.body.Servicename
		 	                            })
     }                       
  }).then(function(data)
  {
    return ServiceRequest.find({})
  }).then(respondWithResult(res))
    .catch(handleError(res));
            
}


// Deletes a ServiceRequest from the DB
// export function updateService(req, res) {
//   return ServiceRequest.update({}).exec()
//     .then(handleEntityNotFound(res))
//     .then(removeEntity(res))
//     .catch(handleError(res));
// }

// Upserts the given ServiceRequest in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return ServiceRequest.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing ServiceRequest in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return ServiceRequest.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a ServiceRequest from the DB
export function destroy(req, res) {
  return ServiceRequest.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
