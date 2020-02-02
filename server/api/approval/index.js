'use strict';

var express = require('express');
var controller = require('./approval.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();
router.post('/saveSuperAdminEmploye',controller.saveSuperAdminEmploye);
router.post('/approveUser',auth.isAuthenticated(),controller.approveUser);
router.post('/rejectuser',auth.isAuthenticated(),controller.rejectUser);
router.post('/', controller.create);
router.post('/getemails', controller.getApprovalsEmails);
router.post('/getApprovals',auth.isAuthenticated(),controller.approvals);
router.get('/inactive',auth.isAuthenticated(), controller.inactiveApprovalsCount);
// router.get('/', controller.index);
// router.get('/:id', controller.show);
// router.put('/:id', controller.upsert);
// router.patch('/:id', controller.patch);
// router.delete('/:id', controller.destroy);
module.exports = router;
