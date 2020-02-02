'use strict';

var express = require('express');
var controller = require('./complaint.controller');
import * as auth from '../../auth/auth.service';
var router = express.Router();

router.get('/', controller.index);
router.get('/getComplaint',auth.isAuthenticated(), controller.getComplaint);//All complaints in Employee Dashboard
router.post('/listComplaints',auth.isAuthenticated(), controller.listComplaints);
router.get('/count',auth.isAuthenticated(), controller.countComplaints);
router.post('/suggestions',auth.isAuthenticated(),controller.getSuggestions)
router.get('/complaintsCounts',auth.isAuthenticated(),controller.complaintsCounts);
router.get('/complaintCount',auth.isAuthenticated(), controller.complaintCount);
router.post('/respectivecomplaint',auth.isAuthenticated(), controller.respectivecomplaint);//complaints based on complaint Status
router.post('/employeeCategoryComplaints',auth.isAuthenticated(), controller.employeeCategoryComplaints);
router.get('/getassignedPersons',auth.isAuthenticated(),controller.getassignedPersons);
// router.get('/:id', controller.show);
router.post('/',auth.isAuthenticated(), controller.create);
router.post('/assignCompliant',auth.isAuthenticated(),controller.assignCompliant);
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;
