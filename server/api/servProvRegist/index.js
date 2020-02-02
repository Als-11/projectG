'use strict';

var express = require('express');
var controller = require('./servProvRegist.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/getReqCommunities',auth.isAuthenticated(),controller.getReqCommunities)//serviceprovider dashboard view
router.get('/getCount',auth.isAuthenticated(), controller.getCount);
router.get('/approveCommCount',auth.isAuthenticated(),controller.approveCommCount);//Approve $& decline the communitiesCount(serviceprovider view)
router.get('/decCommName',auth.isAuthenticated(),controller.decCommName)//decline Community names(provider view)
router.post('/request',auth.isAuthenticated(),controller.request);//community request
router.get('/getserProDetails',auth.isAuthenticated(),controller.getDetails);//serviceprovider details(pending)
// router.get('/getsertypeApprovals',controller.getsertypeApprovals);//servicetypedetails(pending)
router.post('/approveSerProvider',auth.isAuthenticated(),controller.approveSerProvider);  //approve the service provider
router.post('/declineSerProvider',auth.isAuthenticated(),controller.declineSerProvider);//decline the serviceprovider
// router.post('/serviceTypeApp',controller.serviceTypeApp);   //approve the servicetype
// router.post('/declineServiceType',controller.declineServiceType);   //decline the servicetype
// router.post('/getsertypes',controller.getsertypes);//getting the service types based on the serviceproviderId,selectedCategory of service(user view)
// router.get('/:id', controller.show);
router.post('/', controller.create);
// router.put('/:id', controller.upsert);
// router.patch('/:id', controller.patch);
// router.delete('/:id', controller.destroy);

module.exports = router;
