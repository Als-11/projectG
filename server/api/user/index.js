'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();
router.post('/getemails', controller.emails);
router.post('/newpassword', auth.isAuthenticated(),controller.newpassword);
router.get('/activeUsersCount',auth.isAuthenticated(),controller.usersCount);
router.get('/electriciansDetails',auth.hasRole('COMMUNITY_ADMIN'), controller.electriciansDetails);
router.get('/activeusers',auth.isAuthenticated(),auth.hasRole('COMMUNITY_ADMIN'),controller.activeusers);
router.post('/getRespectiveEmployees',auth.isAuthenticated(),auth.hasRole('COMMUNITY_ADMIN'),controller.getRespectiveEmployees);//from complaints page
router.get('/getEmployeeTyped',auth.isAuthenticated(),controller.getEmployeeType);
router.post('/suggestions',auth.isAuthenticated(),auth.hasRole('COMMUNITY_ADMIN'),controller.getSuggestions);//communitymembers users searchbox
router.post('/selecteduserName',auth.isAuthenticated(),controller.selecteduserName);//from settings page
router.post('/customers', auth.isAuthenticated(),controller.customersNames);//usernames (serviceprovider view)
router.post('/getUserId',auth.isAuthenticated(),auth.hasRole('SERVICE_PROVIDER'),controller.getUserId);//userId based on tyhe seleced communityid(serviceproviderView)
router.get('/', auth.hasRole('admin'), controller.index);
router.get('/profilePicture',auth.isAuthenticated(), controller.profile);
router.post('/changeImage',auth.isAuthenticated(),controller.changeImage);
// router.get('/getServices',controller.getServices);
router.get('/getEmployees',auth.isAuthenticated(),controller.getEmployees);
router.post('/getemployeeNames',auth.isAuthenticated(),controller.getemployeeNames);
router.post('/setVisitor',  controller.setVisitor);
router.get('/totalemployeecount', auth.hasRole('COMMUNITY_ADMIN'), controller.totalemployeecount);
// router.post('/bulkusers',controller.bulkusers);
router.post('/changeprofile',auth.isAuthenticated(), controller.changeProfile);
router.post('/uploadBulkUsers',auth.isAuthenticated(),controller.uploadBulkUsers);//upload bulk users
// router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/profile',  auth.isAuthenticated(),controller.profile);
router.post('/', controller.create);

module.exports = router;
