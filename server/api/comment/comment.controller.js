/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/comments              ->  index
 * POST    /api/comments              ->  create
 * GET     /api/comments/:id          ->  show
 * PUT     /api/comments/:id          ->  update
 * DELETE  /api/comments/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Comment from './comment.model';
import History from '../history/history.model';
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

// Gets a list of Comments
export function index(req, res) {
  return Comment.findOne().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Comment from the DB
export function show(req, res) {
  return Comment.find({complaintId:req.params.complaintId}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Comment in the DB
export function create(req, res) {  //retriving the comment history based on the compalintid
  return Comment.find({complaintId:req.body.complaintId})
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Creates a pagination for  Comments

export function getPagination(req, res) {  //retriving the comment history based on the compalintid
  var skip = req.body.page;
  var skipDocuments=parseInt(skip); 
  return Comment.find({complaintId:req.body.complaintNumber,threadId:null}).skip(skipDocuments).limit(10)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}


export function commentsHistory(req, res) {  //retriving the comment history based on the compalintid
var use = jwt.decode(req.cookies.token);    
  return Comment.find({complaintId:req.body.complaintId})
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}


export function previousThreadComments(req, res) {  
var use = jwt.decode(req.cookies.token);    
  return Comment.find({threadId:req.body.threadId}).limit(40).sort({commentId:-1})
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

export function previousThreadskipComments(req, res) {  
var use = jwt.decode(req.cookies.token);
var count=(req.body.count)*40;
  return Comment.find({threadId:req.body.threadId}).skip(count).limit(40).sort({commentId:-1})
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}
export function commentsCreate(req, res) {  
  var use = jwt.decode(req.cookies.token);   
    return History.create({complaintId:req.body.complaintId,userId:use.userId,userInfoId:use.userId,
                              text:" says "+req.body.description,createdAt:new Date()})
   .then(function(data)
        {
              return Comment.create({complaintId:req.body.complaintId,userId:use.userId,userName:use.firstName,
                         description:req.body.description,threadId:null,createdAt:data.createdat})
        })
  .then(respondWithResult(res, 201))
  .catch(handleError(res));
}

export function createThreadComment(req, res) {  
  var use = jwt.decode(req.cookies.token);   
  return Comment.create({threadId:req.body.threadId,userId:use.userId,userName:use.firstName,
                         description:req.body.comment,complaintId:null})
  .then(respondWithResult(res, 201))
  .catch(handleError(res));
}


// Updates an existing Comment in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Comment.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Comment from the DB
export function destroy(req, res) {
  return Comment.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
