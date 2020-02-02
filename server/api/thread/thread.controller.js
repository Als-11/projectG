/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/threads              ->  index
 * POST    /api/threads              ->  create
 * GET     /api/threads/:id          ->  show
 * PUT     /api/threads/:id          ->  update
 * DELETE  /api/threads/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Thread from './thread.model';
import  Topic from '../topic/topic.model';
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

// export function Counts(req, res) {
//    var docs = [];
//    var use = jwt.decode(req.cookies.token);
//    Topic.find({},function(err,data){
//     if(data!=null)
//     {  
//        var i=0;
//        for(;i<data.length;i++) {
//             Thread.count({topicTitle:data[i].title},function(err,data) {
//               if(data !=null){  
//                 var result = data;
//                 docs.push(result);
//               }
//               if(docs.length === 3){
//                 respondWithResult(docs,200) 
//               }
//             })
//          }  
//       }
//   });
//   }

export function Counts(req,res){  //here we get the threads count
   return Topic.aggregate([{
    $lookup: {
            from: "threads",
            localField: "title",
            foreignField: "topicTitle",
            as: "Respectivethread"
          }
}]).exec()
   .then(respondWithResult(res))
    .catch(handleError(res));
}
 

// Gets a list of Threads based on the communityId
export function index(req, res) {
   var use = jwt.decode(req.cookies.token);
  return Thread.find({communityId:use.communityId,topicTitle:req.body.title}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// export function generalDiscussionsCounts(req,res) {
//    var use = jwt.decode(req.cookies.token); 
//      return Thread.count({communityId:use.communityId,topicTitle:"GeneralDiscussions"}).exec()
//      .then(handleEntityNotFound(res))
//         .then(respondWithResult(res))
//         .catch(handleError(res));
//   }
//   export function events(req,res) {
//    var use = jwt.decode(req.cookies.token); 
//      return Thread.count({communityId:use.communityId,topicTitle:"Events"}).exec()
//      .then(handleEntityNotFound(res))
//         .then(respondWithResult(res))
//         .catch(handleError(res));
//   }

//   export function buying(req,res) {
//    var use = jwt.decode(req.cookies.token); 
//      return Thread.count({communityId:use.communityId,topicTitle:"Buying & Selling"}).exec()
//      .then(handleEntityNotFound(res))
//         .then(respondWithResult(res))
//         .catch(handleError(res));
//   }

// Gets a single Thread from the DB
export function show(req, res) {
  return Thread.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Thread in the DB
export function create(req, res) {
  var use = jwt.decode(req.cookies.token);
  return Thread.create({title:req.body.title,description:req.body.description,
                         topicTitle:req.body.topicTitle,communityId:use.communityId,
                         userId:use.userId})
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

//delete thread
export function deleteThread(req, res) {
 var use = jwt.decode(req.cookies.token);
  var user = use.userId;
  var userId = req.body.userId;
  return Thread.find({userId:req.body.userId,threadId:req.body.threadId}).remove().exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}


// Updates an existing Thread in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Thread.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Thread from the DB
export function destroy(req, res) {
  return Thread.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
