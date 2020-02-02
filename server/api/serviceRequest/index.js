'use strict';

var express = require('express');
var controller = require('./serviceRequest.controller');
import * as auth from '../../auth/auth.service';
var router = express.Router();

// router.get('/', controller.index);
router.get('/listServices',auth.isAuthenticated(), controller.listServices);//user view(list of adapt services)
router.post('/userServices', auth.isAuthenticated(),controller.userServices);//create a user services for each service type
router.post('/dayByDayServices',auth.isAuthenticated(), controller.dayByDayServices);//day by day services(calender view)
router.post('/selectDayService',auth.isAuthenticated(), controller.selectDayService);//day (selected) services(calender-,model view)
router.post('/downArrow',auth.isAuthenticated(),controller.downArrow);//day by day orders to the serviceprovider(provider view)
router.post('/updateService',auth.isAuthenticated(),controller.updateService);//update day service(calender-model view)
router.post('/deleteService',auth.isAuthenticated(),controller.deleteService);//delete day service(calender-model view)
router.post('/additonalService',auth.isAuthenticated(),controller.additonalService);//additonal  day service(calender-model view)
router.post('/deleteServices',auth.isAuthenticated(),controller.deleteServices);//custom delete services(week,monhly,15days);
router.post('/inProcessingRequest',auth.isAuthenticated(),controller.inProcessingRequest);//Status changes to Pending,Accepted,Deliverd;
router.post('/getAllOrdersCommunity',auth.isAuthenticated(),controller.getAllOrdersCommunity);//All orders to the respective community
// router.put('/:id', controller.upsert);
// router.patch('/:id', controller.patch);
// router.delete('/:id', controller.destroy);

module.exports = router;
