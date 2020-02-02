'use strict';

import User from './user.model';
import Counters from '../../models/counters.model';
import pwdgen from 'password-generator';
import help from 'sendgrid';
import passport from 'passport';
import config from '../../config/environment';
import ServiceProviderDetail from '../serviceProviderDetail/serviceProviderDetail.model';
import Community from '../community/community.model';
import Complaint from '../complaint/complaint.model';
import jwt from 'jsonwebtoken';
var helper = help.mail;
var generatePassword = require('password-generator');
// var async = require('async')

function validationError(res, statusCode) {
    statusCode = statusCode || 422;
    return function(err) {
        res.status(statusCode).json(err);
    }
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function(err) {
        res.status(statusCode).send(err);
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

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function(entity) {
        if (entity) {
            return res.status(statusCode).json(entity);
        }
        return null;
    };
}

//userId based on tyhe seleced communityid(providerView)
export function getUserId(req, res) {
    var use = jwt.decode(req.cookies.token);
    Community.findOne({ "communityName": req.body.communityName })
        .then(function(data) {
            return User.find({ communityId: data.communityId, firstName: req.body.firstName, houseNumber: req.body.houseNumber }, { _id: 0, salt: 0, password: 0, lockUntil: 0, loginAttempts: 0 }).exec()
                .then(handleEntityNotFound(res))
                .then(respondWithResult(res))
                .catch(handleError(res));
        })

}

//usernames (serviceprovider view)
export function customersNames(req, res) {
    var use = jwt.decode(req.cookies.token);
    Community.findOne({ "communityName": req.body.communityName, "address.address1": req.body.address1, "address.locality": req.body.locality })
        .then(function(data) {

            var key = (req.body.keyword);
            return User.find({
                    communityId: data.communityId,
                    firstName: { $regex: new RegExp("^" + key, "i") },
                    role: "RESIDENT"
                }) //ignoring the case
                .then(handleEntityNotFound(res))
                .then(respondWithResult(res))
                .catch(handleError(res));

        })
}

export function newpassword(req, res) {
    var use = jwt.decode(req.cookies.token);
    var emailId = req.body.emailId;
    var password = generatePassword(8, false);
    User.findOne({ email: req.body.emailId }, { _id: 0, lockUntil: 0, loginAttempts: 0 })
        .then(function(user) {
            user.password = password;
            user.emailId = emailId;
            return user.save()
                .then(() => {
                    res.status(204)
                }).then(respondCommunityWithResult(res, user.password, user.emailId, 204))
        })
}

function respondCommunityWithResult(res, password, emailId, statusCode) {
    statusCode = statusCode || 204;
    return function() {
        if (emailId) {
            res.status(statusCode).json();
            mail(emailId, password);
        }
    };
}

export function mail(emailId, password) {

    var helper = require('sendgrid').mail;
    var from_email = new helper.Email("noreply@guwha.com");
    var to_email = new helper.Email(emailId);
    var subject = "Welcome to Guwha Community";
    var bodyContent = "Hi, \n Welcome to Guwha \n Your username : " + emailId + " \n Your New Password Is : " + password + "\nRegards,\nGuwha";
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

//users count based on communityId
export function usersCount(req, res) {
    var use = jwt.decode(req.cookies.token);
    return User.count({ communityId: use.communityId, role: "RESIDENT" }).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

//user name searchbox
export function getSuggestions(req, res) {
    var use = jwt.decode(req.cookies.token);
    var key = (req.body.keyword);
    return User.find({ communityId: use.communityId, firstName: { $regex: new RegExp("^" + key, "i") }, role: "RESIDENT" }, { _id: 0, salt: 0, password: 0, lockUntil: 0, loginAttempts: 0 }).exec() //ignoring the case
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}
//user info for the settings page
export function selecteduserName(req, res) {
    var use = jwt.decode(req.cookies.token);
    return User.find({ communityId: use.communityId, firstName: req.body.firstName, houseNumber: req.body.houseNumber }, { _id: 0, salt: 0, password: 0, lockUntil: 0, loginAttempts: 0 }).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

//active users data
export function activeusers(req, res) {
    var use = jwt.decode(req.cookies.token);
    return User.aggregate([{ "$match": { role: 'RESIDENT', communityId: use.communityId } }, {
            "$lookup": {
                from: "floors",
                localField: "communityId",
                foreignField: "communityId",
                as: "floorsarray"
            }
        }])
        .then(respondWithResult(res))
        .catch(handleError(res));
}

export function getEmployees(req, res) {
    var use = jwt.decode(req.cookies.token);
    return User.distinct('employeeType', { communityId: use.communityId, role: 'EMPLOYEE' }).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

export function getemployeeNames(req, res) {
    var use = jwt.decode(req.cookies.token);
    return User.find({ communityId: use.communityId, role: 'EMPLOYEE', employeeType: req.body.employeeType }, { firstName: 1, userId: 1 }).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}



export function setVisitor(req, res) {
    var use = jwt.decode(req.cookies.token);
    return User.findOne({ communityId: use.communityId, houseNumber: req.body.houseNumber }, { _id: 0, salt: 0, password: 0, lockUntil: 0, loginAttempts: 0 }).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}
//Here we get the users profile data
export function profile(req, res) {
    var use = jwt.decode(req.cookies.token);
    return User.findOne({ communityId: use.communityId, userId: use.userId }, { _id: 0, salt: 0, password: 0, lockUntil: 0, loginAttempts: 0 }).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

export function changeImage(req, res) {
    var use = jwt.decode(req.cookies.token);
    var path = require('path');
    var formidable = require('formidable');
    var fs = require('fs');
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '../../../uploads');

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(field, file) {
        // fs.rename(file.path, path.join(form.uploadDir, file.name));
        var aws = require('aws-sdk');
        aws.config.update({
            secretAccessKey: 'ciGACmBN5Ve8gutKdVGxb8OXWdiRutK+Go9KQws/',
            accessKeyId: 'AKIAJCYJN2NTFLDYOD5A',
            region: 'us-east-1'
        });
        var s3 = new aws.S3();
        fs.readFile(file.path, function(err, data) {
            if (err) throw err; // Something went wrong!
            var fileName = file.name;
            var uniqueKey = use.userId + fileName.substr(fileName.lastIndexOf('.'));
            var params = {
                Bucket: 'guwha-uploads',
                Key: uniqueKey,
                Body: data
            };

            s3.upload(params, function(err, data) {
                // Whether there is an error or not, delete the temp file
                fs.unlink(file.path, function(err) {
                    if (err) {
                        console.error(err);
                    }
                });

                if (err) {
                    res.status(500).send(err);
                } else {
                    var use = jwt.decode(req.cookies.token);
                    return User.update({ communityId: use.communityId, userId: use.userId }, {
                            $set: {
                                imageUrl: data.Location
                            }
                        }, { safe: true }).exec()
                        .then(handleEntityNotFound(res))
                        .then(function(data) {
                            return User.findOne({ userId: use.userId }).exec()
                                .then(respondWithResult(res))
                        }).catch(handleError(res));
                    //res.status(200).end();
                }
            });
        });
    });

    // log any errors that occur
    form.on('error', function(err) {});

    // once all the files have been uploaded, send a response to the client
    //  form.on('end', function() {
    //    res.end('success');
    //  }); 

    // parse the incoming request containing the form data
    form.parse(req);
}


export function uploadBulkUsers(req, res) {
    var use = jwt.decode(req.cookies.token);
    var path = require('path');
    var formidable = require('formidable');
    var fs = require('fs');
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = false;
    var count = 0;
    var communityId = use.communityId;
    var result = [];
    var resultArray  = [];
    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '../../../uploads');

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(field, file) {
        fs.readFile(file.path, function(err, data) {
            if (err) throw err; // Something went wrong!
            var parse = require('csv-parse');
            var csvData = [];
            fs.createReadStream(file.path)
                .pipe(parse({ delimiter: ',' }))
                .on('data', function(csvrow) {
                    if (count != 0) {
                         createUser(csvrow, count, result, communityId)
                            //,function(data,err)
                        // {
                        //    if(data){
                        //         console.log("Hero"+data);
                        //    }
                        //    else{
                        //     throw err;
                        //    }
                        // })
                    }
                    count++;
                })
                // .on('end', function() {
                //     //do something wiht csvData
                //    res.end('success'+resultArray);  
                // });

        });
    });

    // log any errors that occur
    form.on('error', function(err) {});

    // once all the files have been uploaded, send a response to the client
    //  form.on('end', function() {
    //    res.end('success');
    //  });

    // parse the incoming request containing the form data
    form.parse(req);
}
 
function createUser(row, count, array, communityId,callback) {      //csv parser to create ythe userss
    var password = generatePassword(8, false);
    User.find({ email: row[4] })
        .then(function(data, err) {
            if (data.length == 0) {
                User.create({
                    firstName: row[0],
                    lastName: row[1],
                    Gender: row[2],
                    phoneNumber: row[3],
                    email: row[4],
                    houseNumber: row[5] + "-" + row[6],
                    password: password,
                    role: 'RESIDENT',
                    communityId: communityId,
                    blockName: row[5],
                    lockUntil: 0
                }).then(function(data, err) {
                    if (data) {
                        var object = count + "Successfully Created the row";
                        array.push(object);
                        return array;
                    } else {
                        var object = count + "Error in creating the row";
                        array.push(object);
                        return array;
                    }
                });

            } else {
                var object = count + "Aleardy EmailExist";
                array.push(object);
                return array
            }
        }).then(function(data,err)
        {
            if (err){
            console.log("error");
             }
        else{
            console.log('The solution is in branch: \n', array);
            }
        })
        
            /* This data stack 3  */
            // callback(data.rows[0];);
        }
       


//Here we take New Name for user and Edit it
export function changeProfile(req, res) {
    var use = jwt.decode(req.cookies.token);
    return User.update({ communityId: use.communityId, userId: use.userId }, {
            $set: {
                phoneNumber: req.body.phoneNumber
            }
        }, { safe: true }).exec()
        .then(handleEntityNotFound(res))
        .then(function(data) {
            return User.findOne({ userId: use.userId }, { _id: 0, salt: 0, password: 0, lockUntil: 0, loginAttempts: 0 }).exec()
                .then(respondWithResult(res))
        })
        .catch(handleError(res));
}


//get the employeetype for the employeerole
export function getEmployeeType(req, res) {
    var use = jwt.decode(req.cookies.token);
    return User.findOne({ communityId: use.communityId, userId: use.userId }, { _id: 0, salt: 0, password: 0, lockUntil: 0, loginAttempts: 0 }).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}


/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
    return User.find({}, '-salt -password').exec()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res, next) {
    var newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.role = 'user';
    newUser.save()
        .then(function(user) {
            var token = jwt.sign({ _id: user._id }, config.secrets.session, {
                expiresIn: 60 * 60 * 5
            });
            res.json({ token });
        })
        .catch(validationError(res));
}

//validation for emailid exist or not
export function emails(req, res) {
    return User.count({ email: req.body.emailId }).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
    return User.findById(userId).exec()
        .then(user => {
            if (!user) {
                return res.status(404).end();
            }
            res.json(user.profile);
        })
        .catch(err => next(err));
}


export function totalemployeecount(req, res, next) {
    var use = jwt.decode(req.cookies.token)
    return Employee.aggregate(
            [{
                $match: {
                    communityId: use.communityId
                }
            }, {
                $group: {
                    _id: { communityId: "$communityId", employeeType: "$employeeType" },
                    count: { $sum: 1 }
                }
            }, {
                $project: {
                    _id: 0,
                    role: "$_id.employeeType",
                    count: 1
                }
            }]
        ).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}


export function electriciansDetails(req, res) {
    var use = jwt.decode(req.cookies.token);
    return Employee.find({ communityId: use.communityId, role: "EMPLOYEE" }).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}
export function getRespectiveEmployees(req, res) { //employees to assign the complaint (complaints view)
    var use = jwt.decode(req.cookies.token);
    var status = req.body.status;
    if (status == "Assigned") {
        Complaint.findOne({ complaintId: req.body.complaintId })
            .then(function(data) {
                return User.find({ userId: data.userId })
                    .then(respondWithResult(res))
                    .catch(handleError(res));
            })
    } else if (status == "Open") {
        return Employee.find({ communityId: use.communityId, role: "EMPLOYEE", employeeType: req.body.selectedCategory }).exec()
            .then(handleEntityNotFound(res))
            .then(respondWithResult(res))
            .catch(handleError(res));
    }
}
/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
    return User.findByIdAndRemove(req.params.id).exec()
        .then(function() {
            res.status(204).end();
        })
        .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res, next) {
    var userId = req.user._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);
    console.log(oldPass);
    return User.findById(userId).exec()
        .then(user => {
            console.log(user)
            if (user.authenticate(null, oldPass)) {
                user.password = newPass;
                return user.save()
                    .then(() => {
                        res.status(204).end();
                    })
                    .catch(validationError(res));
            } else {
                return res.status(403).end();
            }

        });
}

/**
 * Get my info
 */
export function me(req, res, next) {
    var userId = req.user._id;
    return User.findOne({ _id: userId }, '-salt -password').exec()
        .then(user => { // don't ever give out the password or salt
            if (!user) {
                return res.status(401).end();
            }
            res.json(user);
        })
        .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res, next) {
    res.redirect('/');
}
