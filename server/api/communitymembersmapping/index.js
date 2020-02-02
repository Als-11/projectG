'use strict';

var express = require('express');
var controller = require('./communitymembersmapping.controller');
import * as auth from '../../auth/auth.service';
var router = express.Router();

router.get('/communitymemberslist', auth.isAuthenticated(),auth.hasRole('COMMUNITY_ADMIN'),controller.communitymemberslist);
// router.get('/:id', controller.show);
router.post('/createmember',auth.isAuthenticated(),auth.hasRole('COMMUNITY_ADMIN'), controller.createmember);
router.get('/membersCount',auth.isAuthenticated(),auth.hasRole('COMMUNITY_ADMIN'),controller.membersCount);
router.post('/updatememberslist',auth.isAuthenticated(),auth.hasRole('COMMUNITY_ADMIN'),controller.updatememberslist);
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;
