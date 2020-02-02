'use strict';

var express = require('express');
var controller = require('./paymentsrequests.controller');
import * as auth from '../../auth/auth.service';


var router = express.Router();
router.post('/createpayrequest',auth.isAuthenticated(), controller.createpayrequest);
router.post('/maintenanceexpenseSave',auth.isAuthenticated(), controller.maintenanceexpenseSave);
router.get('/getPayment',auth.isAuthenticated(),controller.getPayment);//getpayments(user & CommnityAdminview)
router.get('/getPayments',auth.isAuthenticated(),controller.getPayments);//getpayments(serviceprovider view)
router.get('/getuserPayments',auth.isAuthenticated(),controller.getuserPayments);
router.get('/getadminPayments',auth.isAuthenticated(),controller.getadminPayments);
router.get('/payDetailsFrTble',auth.isAuthenticated(),controller.payDetailsFrTble);//getpayments table view(serviceprovider view)
router.post('/getPaymenDetail',auth.isAuthenticated(),controller.getPaymenDetail);//getpayments table view(serviceprovider view)
// router.get('/', controller.index);
// router.get('/:id', controller.show);
// router.put('/:id', controller.upsert);
// router.patch('/:id', controller.patch);
// router.delete('/:id', controller.destroy);

module.exports = router;
