'use strict';

var express = require('express');
var controller = require('./visitor.controller');
import * as auth from '../../auth/auth.service';
var router = express.Router();

router.get('/', controller.index);
// router.get('/:id', controller.show);
router.get('/getHighestVisitors',auth.isAuthenticated(),controller.getHighestVisitors);//get highest visitors(communityAdmin dashboard)
router.get('/getVisitors',auth.isAuthenticated(), controller.getVisitors);//daily visitors
router.get('/getMonthlyVisitors', auth.isAuthenticated(),controller.getMonthlyVisitors);//monthly visitors
router.post('/getSkippedVisitors',auth.isAuthenticated(), controller.getSkippedVisitors);
router.post('/userSkippedVisitors',auth.isAuthenticated(), controller.userSkippedVisitors);
router.post('/userVisitors',auth.isAuthenticated(), controller.userVisitors);//RESIDENT related visitors
router.post('/visitorsCount', auth.isAuthenticated(),controller.visitorsCount);//counting the counters
router.post('/create',auth.isAuthenticated(), controller.createVisitor); //creating a visitor
router.post('/deleteVisitor',auth.isAuthenticated(), controller.deleteVisitor); //deleting the visitors
router.post('/updatetime',auth.isAuthenticated(), controller.updateOutTime);//updating the outtime for visitors
router.post('/visitors',auth.isAuthenticated(),controller.visitorsLeft);
// router.post('/', controller.create);
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;
