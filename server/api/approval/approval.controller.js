/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/approvals              ->  index
 * POST    /api/approvals              ->  create
 * GET     /api/approvals/:id          ->  show
 * PUT     /api/approvals/:id          ->  upsert
 * PATCH   /api/approvals/:id          ->  patch
 * DELETE  /api/approvals/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Approval from './approval.model';
import jwt from 'jsonwebtoken';
import pwdgen from 'password-generator';
import User from '../user/user.model';
import Floors from '../floors/floors.model';

var generatePassword = require('password-generator');


function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function(entity) {
        if (entity) {
            return res.status(statusCode).json(entity);
        }
        return null;
    };
}

function patchUpdates(patches) {
    return function(entity) {
        try {
            jsonpatch.apply(entity, patches, /*validate*/ true);
        } catch (err) {
            return Promise.reject(err);
        }

        return entity.save();
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

// Gets a list of Approvals
export function index(req, res) {
    return Approval.find().exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}



// Save superadmin employee from superadmin view
export function saveSuperAdminEmploye(req, res) {
    var use = jwt.decode(req.cookies.token);
     var password = generatePassword(8, false);
    return User.create({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        phoneNumber:req.body.phonenumber,
        role:req.body.role,
        password:password,
        customerId: [],
        lockUntil:0
    }) .then(respondCommunityWithResult(res, password, 201))
    .then(respondWithResult(res))
        .catch(handleError(res));
   

}

// Gets a single Approval from the DB
export function show(req, res) {
    return Approval.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}
//list of approvals based on communityId
export function approvals(req, res) {
    return Approval.find({ communityId: req.body.communityId, approvalStatus: "PENDING" }).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}


//Getting the Approvals emails who requested for registration
export function getApprovalsEmails(req, res) {
    return Approval.count({ emailId: req.body.emailId }).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}



//Approve the User
export function approveUser(req, res) {
    var use = jwt.decode(req.cookies.token);
    Approval.update({ communityId: use.communityId, emailId: req.body.emailId }, { $set: { approvalStatus: "APPROVED" } }, { safe: true }).exec()
        .then(function(data) {
            return User.findOne({ email: req.body.emailId })
                .then(function(data) {
                    if (data == null) {
                        // Then user already exists in the User collection, I'll reject this request
                        Approval.update({ communityId: use.communityId, emailId: req.body.emailId }, { $set: { approvalStatus: "REJECTED" } }, { safe: true }).exec();
                        throw new Error("User already exists");
                    } else {
                        Floors.findOne({ houseNumber: data.houseNumber })
                            .then(function(data) {
                                User.update({ email: req.body.emailId }, { $set: { communityId: use.communityId, floorId: data.floorId } }, { safe: true }).exec();
                            })

                    }

                })
        }).then(function(data)
        {
           return Approval.find({})
            .then(respondWithResult(res))
           .catch(handleError(res));

        })


    // .then(handleEntityNotFound(res))
    // .then(function(data){
    //   return Approval.findOne({emailId:req.body.emailId,approvalStatus:"APPROVED"}).exec()
    //   .then(respondWithResult(res))
    // })
    // .then(function(data){
    //     // Here I'll try to insert a record into User collection
    //     // Check if the user already exists with this emailId in Users collection    
    //     return User.findOne({email: req.body.emailId })
    //         .then(function(data){
    //             if( data == null){
    //            // Then user already exists in the User collection, I'll reject this request
    //                 Approval.update({communityId:use.communityId, emailId:req.body.emailId},
    //                                        {$set:{approvalStatus:"REJECTED"}},{safe:true}).exec();
    //                 throw new Error("User already exists");
    //             }else{ 

    //                   Floors.findOne({houseNumber:data.houseNumber})
    //                   .then(function(data)
    //                   {
    //                     User.update({email:req.body.emailId},{$set:{communityId:use.communityId,floorId:data.floorId}}
    //                     ,{safe:true}).exec();
    //                   })

    //             }
    //         });
    // })
    // .then(respondWithResult(res))
    // .catch(handleError(res));
}

//Reject the user
export function rejectUser(req, res) {
    var use = jwt.decode(req.cookies.token);
    return Approval.update({ communityId: use.communityId, emailId: req.body.emailId }, { $set: { approvalStatus: "REJECTED" } }, { safe: true }).exec()
        .then(handleEntityNotFound(res))
        .then(function(data) {
            return Approval.findOne({ emailId: req.body.emailId }).exec()
                .then(respondWithResult(res))
        })
        .catch(handleError(res));
}


//inactive approvalscount
export function inactiveApprovalsCount(req, res) {
    var use = jwt.decode(req.cookies.token);
    return Approval.find({ communityId: use.communityId, approvalStatus: "PENDING" }).exec()
        // .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}
// Creates a new Approval in the DB
export function create(req, res) {
    var password = generatePassword(8, false);
    Approval.create({
            communityName: req.body.communityName,
            firstName: req.body.firstName,
            blockName: req.body.blockName,
            floorNumber: req.body.floorNumber,
            emailId: req.body.emailId,
            flatNumber: req.body.flatNumber,
            phoneNumber: req.body.phoneNumber,
            communityId: req.body.communityId,
            gender: req.body.gender,
            approvalStatus: "PENDING"
        })
        .then(function(data) {
            return User.create({
                firstName: req.body.firstName,
                email: req.body.emailId,
                houseNumber: req.body.blockName + "-" + req.body.flatNumber,
                phoneNumber: req.body.phoneNumber,
                password: password,
                role: 'RESIDENT',
                communityId: null,
                blockName: req.body.blockName,
                lockUntil: 0,
                lastName: req.body.lastName,
                Gender: req.body.gender,
                imageUrl: req.body.imageUrl

            }).then(respondCommunityWithResult(res, password, 201))

        }).then(respondWithResult(res))
        .catch(handleError(res));
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

export function mail(emailId, password) {

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
    sg.API(request, function(response) {})

}

// //update the user status 
// export function approvals(req,res){
//    var use = jwt.decode(req.cookies.token); 
//     return Approval.findOneAndUpdate({communityId:use.communityId,emailId:req.body.emailId},
//          {$set:{approvedStatus:"APPROVED"}},{safe:true}).exec()
//         .then(handleEntityNotFound(res))
//         .//         .catch(handleError(res));
// }


// Upserts the given Approval in the DB at the specified ID
export function upsert(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    return Approval.findOneAndUpdate(req.params.id, req.body, { upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec()

    .then(respondWithResult(res))
        .catch(handleError(res));
}

// Updates an existing Approval in the DB
export function patch(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    return Approval.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a Approval from the DB
export function destroy(req, res) {
    return Approval.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}
