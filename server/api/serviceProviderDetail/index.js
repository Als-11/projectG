'use strict';

var express = require('express');
var controller = require('./serviceProviderDetail.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

// router.get('/', controller.index);
// router.get('/:id', controller.show);
// router.get('/getcommunity',controller.communitiesInfo);//communityinfo(serviceprovider dashboard)
router.post('/getServicesNames',auth.isAuthenticated(),controller.getServicesNames);//get Services info for dropdown(payments-provider view);
router.get('/getcommunities',auth.isAuthenticated(),controller.getcommunities);//get communities info for dropdown(payments-provider view);
router.get('/appCommName',auth.isAuthenticated(),controller.appCommName)//approved Community names(provider view)
router.post('/getserviceTypes',auth.isAuthenticated(),controller.getserviceTypes)//getting the servicetypes based on te service (provider view)
router.post('/anothermethod',auth.isAuthenticated(),controller.anothermethod);
// router.get('/orders',controller.orders)//day by day orders to the serviceprovider(provider view)
router.post('/serviceproviderDetail',auth.isAuthenticated(),controller.serviceproviderDetail);
router.post('/getSelectedBrands',auth.isAuthenticated(),controller.getSelectedBrands);//show brands to ythe user(services view)
router.post('/names',auth.isAuthenticated(),controller.names);
router.post('/create',controller.create);//create the service provider
router.post('/getServicesCat', auth.isAuthenticated(),controller.getServicesCat);//geeting the serviceCategories
router.get('/serviceName',auth.isAuthenticated(),controller.serviceName);//getting the servicenames and provider count
router.get('/serviceProviderProfile',auth.isAuthenticated(),controller.serviceProviderProfile);//getting the service provider details
// router.put('/:id', controller.upsert);
// router.patch('/:id', controller.patch);
// router.delete('/:id', controller.destroy);

module.exports = router;
