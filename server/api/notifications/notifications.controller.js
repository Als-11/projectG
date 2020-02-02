/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/notificationss              ->  index
 * POST    /api/notificationss              ->  create
 * GET     /api/notificationss/:id          ->  show
 * PUT     /api/notificationss/:id          ->  update
 * DELETE  /api/notificationss/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Notifications from './notifications.model';
import jwt from 'jsonwebtoken';
import User from '../user/user.model';

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function (entity) {
        if (entity) {
            res.status(statusCode).json(entity);
        }
    };
}

function saveUpdates(updates) {
    return function (entity) {
        var updated = _.merge(entity, updates);
        return updated.save()
            .then(updated => {
                return updated;
            });
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

// Gets a list of unread-Notificationss
export function getNotification(req, res) {
    var use = jwt.decode(req.cookies.token);

    if (use.role == "RESIDENT") {
        // return Notifications.find({communityId:use.communityId,userId:use.userId,isRead:false})
        return Notifications.aggregate([
            {
                "$match": {
                    communityId: use.communityId,
                    userId: use.userId,
                    isRead: false
                }
            },
            {
                "$lookup": {
                    from: "notifications",
                    localField: "notificationuniqueId",
                    foreignField: "notificationId",
                    as: "TotalInfo"
                }
            },
            {
                "$group": {
                    "_id": {
                        Read: "$isRead",
                        title: "$title",
                        description: "$description",
                        notificationuniqueId: "$notificationuniqueId",
                        isResponded: "$isResponded",
                        isPoll: "$isPoll",
                        notificationId: "$notificationId",
                        commNotif: "$TotalInfo"
                    },
                    count: {
                        "$sum": 1
                    }
                }
            }
   ])

        .then(respondWithResult(res))
            .catch(handleError(res));
    } else {
        return Notifications.find({
                communityId: use.communityId,
                userId: use.userId,
                notificationuniqueId: null
            }).exec() //admin notifications
            .then(respondWithResult(res))
            .catch(handleError(res));
    }
}

// Gets a list of read-Notificationss(user)
export function readNotification(req, res) {
    var use = jwt.decode(req.cookies.token);
    if (use.role == "RESIDENT") {
        return Notifications.aggregate([
                {
                    "$match": {
                        communityId: use.communityId,
                        userId: use.userId,
                        isRead: true
                    }
                },
                {
                    "$lookup": {
                        from: "notifications",
                        localField: "notificationuniqueId",
                        foreignField: "notificationId",
                        as: "TotalInfo"
                    }
                },
                {
                    "$group": {
                        "_id": {
                            Read: "$isRead",
                            title: "$title",
                            description: "$description",
                            notificationuniqueId: "$notificationuniqueId",
                            isResponded: "$isResponded",
                            isPoll: "$isPoll",
                            notificationId: "$notificationId",
                            commNotif: "$TotalInfo"
                        },
                        count: {
                            "$sum": 1
                        }
                    }
                },
                {
                    "$sort": {
                        "_id.notificationId": -1
                    }
                }
   ])
            .then(respondWithResult(res))
            .catch(handleError(res));
    }
}

export function markAllRead(req, res) {
    var use = jwt.decode(req.cookies.token);
    if (use.role == "RESIDENT") {
        Notifications.update({
                communityId: use.communityId,
                userId: use.userId,
                isRead: false
            }, {
                "$set": {
                    isRead: true
                }
            })
            .then(handleEntityNotFound(res))
            .then(respondWithResult(res))
            .catch(handleError(res));
    }
}

export function doaction(req, res) {
    var use = jwt.decode(req.cookies.token);
    if (use.role == "RESIDENT") {
        if (req.body.selected == "Accept") {
            Notifications.update({
                    notificationId: req.body.uniqueId
                }, {
                    "$addToSet": {
                        "approvedUsers": use.userId
                    }
                })
                .then(function (data) {
                    Notifications.update({
                            notificationId: req.body.notificationId
                        }, {
                            "$set": {
                                isRead: true,
                                isResponded: "Accept"
                            }
                        })
                        .then(handleEntityNotFound(res))
                        .then(respondWithResult(res))
                        .catch(handleError(res));
                })

        } else if (req.body.selected == "Decline") {
            Notifications.update({
                    notificationId: req.body.uniqueId
                }, {
                    "$addToSet": {
                        "declinedUsers": use.userId
                    }
                })
                .then(function (data) {
                    Notifications.update({
                            notificationId: req.body.notificationId
                        }, {
                            "$set": {
                                isRead: true,
                                isResponded: "Decline"
                            }
                        })
                        .then(handleEntityNotFound(res))
                        .then(respondWithResult(res))
                        .catch(handleError(res));
                })

        } else if (req.body.selected == "Maybe") {
            Notifications.update({
                    notificationId: req.body.uniqueId
                }, {
                    "$addToSet": {
                        "maybeusers": use.userId
                    }
                })
                .then(function (data) {
                    Notifications.update({
                            notificationId: req.body.notificationId
                        }, {
                            "$set": {
                                isRead: true,
                                isResponded: "MayBe"
                            }
                        })
                        .then(handleEntityNotFound(res))
                        .then(respondWithResult(res))
                        .catch(handleError(res));
                })

        }
    }
}



// Gets a single Notifications from the DB
export function unReadcount(req, res) {
    var use = jwt.decode(req.cookies.token);
    if (use.role == 'RESIDENT') {
        return Notifications.count({
                communityId: use.communityId,
                userId: use.userId,
                isRead: false
            })
            .then(handleEntityNotFound(res))
            .then(respondWithResult(res))
            .catch(handleError(res));
    } else
    if (use.role == "COMMUNITY_ADMIN") {
        return Notifications.count({
                communityId: use.communityId,
                userId: use.userId
            })
            .then(handleEntityNotFound(res))
            .then(respondWithResult(res))
            .catch(handleError(res));
    }
}



// Gets a  Notifications from the DB to show envelop
export function getEnvelopNotification(req, res) {
    var use = jwt.decode(req.cookies.token);
    if (use.role == "RESIDENT") {
        return Notifications.find({
                communityId: use.communityId,
                userId: use.userId
            }).sort({
                notificationId: -1
            }).limit(6)
            .then(respondWithResult(res))
            .catch(handleError(res));
    } else
    if (use.role == "COMMUNITY_ADMIN") {
        return Notifications.find({
                communityId: use.communityId,
                userId: use.userId
            }).sort({
                notificationId: -1
            }).limit(6)
            .then(handleEntityNotFound(res))
            .then(respondWithResult(res))
            .catch(handleError(res));
    }
    //  if(use.role == 'null'){
    //   return Notifications.find({})
    // .then(respondWithResult(res))
    // .catch(handleError(res));
    // }

}

// saves a new Notifications in the DB
export function saveNotification(req, res) {
    var use = jwt.decode(req.cookies.token);
    var emailId= [];
    var mailContent =req.body.description;
    var pollingStatus = false;
    if (req.body.pollingStatus == "YES") {
        pollingStatus = true;
    }
    Notifications.create({
            title: req.body.title,
            description: req.body.description,
            userId: use.userId,
            notificationuniqueId: null,
            isPoll: pollingStatus,
            communityId: use.communityId,
            createdBy: use.firstName
        })
        .then(function (data) {
            var notidicationId = data.notificationId;
            var pollingStatus = data.isPoll;
            if (pollingStatus == true) { //check out the pooling status
                var response = false;
            } else {
                response = null;
            }
            User.find({
                communityId: use.communityId,
                role: "RESIDENT"
            }).then(function (data) {
                for (var i = 0; i < data.length; i++) { //users notifications craeate
                    Notifications.create({
                        title: req.body.title,
                        description: req.body.description,
                        isPoll: pollingStatus,
                        userId: data[i].userId,
                        notificationuniqueId: notidicationId,
                        communityId: use.communityId,
                        createdBy: use.firstName,
                        isResponded: response,
                        isRead: false
                    })
                   emailId.push(data[i].email);
                }
             sendGrpMail(emailId,mailContent);  //send group email
            })
        }).then(function (data) {
            return Notifications.find()
            .then(handleEntityNotFound(res))
                .then(respondWithResult(res))
                .catch(handleError(res));
        })
}

// Updates an existing Notifications in the DB
export function update(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    return Notifications.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(saveUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a Notifications from the DB
export function destroy(req, res) {
    return Notifications.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}

export function sendIndMail(email,mailContent){
  var helper = require('sendgrid').mail;
  var from_email = new helper.Email("noreply@guwha.com");
  var to_email = new helper.Email(email);
  var subject = "Notification From Guwha Community";
  var bodyContent = mailContent;
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

export function sendGrpMail(emailarr,mailContent){
    for(var i=0;i<emailarr.length;i++){

       sendIndMail(emailarr[i],mailContent)
    }


}