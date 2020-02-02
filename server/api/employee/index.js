'use strict';

import * as auth from '../../auth/auth.service';

var express = require('express');
var controller = require('./employee.controller');

var router = express.Router();

router.get('/', controller.index);
// router.get('/:id', controller.show);
router.get('/totalemployeecount', auth.isAuthenticated(),controller.totalemployeecount);//from employee controller
router.post('/',auth.isAuthenticated(), controller.create);
router.get('/getEmployees',auth.isAuthenticated(),controller.getEmployees);//from complaints
router.post('/getemployeeNames',auth.isAuthenticated(),controller.getemployeeNames);//from complaint
router.get('/getEmployeeTyped',auth.isAuthenticated(),controller.getEmployeeType);//from communityservice
router.post('/electriciansDetails',auth.hasRole('COMMUNITY_ADMIN'), controller.electriciansDetails);//from employee
router.post('/getRespectiveEmployees',auth.hasRole('COMMUNITY_ADMIN'),controller.getRespectiveEmployees);//from complaints page
router.get('/totalemployeecount', auth.hasRole('COMMUNITY_ADMIN'), controller.totalemployeecount);//from employee controller
router.post('/assignedemployeName',auth.isAuthenticated(),controller.assignedemployeName);
// router.post('/create1', controller.create1);
router.post('/deleteEmployee', auth.isAuthenticated(),controller.deleteEmployee);
router.post('/setToDate', auth.isAuthenticated(),controller.setToDate);//from employee 
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:userId', controller.destroy);

module.exports = router;
