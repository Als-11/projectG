'use strict';

var express = require('express');
import * as auth from '../../auth/auth.service';
var controller = require('./floors.controller');

var router = express.Router();

router.get('/getMaintnceDetails',auth.isAuthenticated(),auth.hasRole('COMMUNITY_ADMIN'), controller.getMaintnceDetails);
router.post('/flatnumberSearch',auth.isAuthenticated(),auth.hasRole('COMMUNITY_ADMIN'), controller.flatnumberSearch);
router.post('/bulkEditSave',auth.isAuthenticated(),auth.hasRole('COMMUNITY_ADMIN'), controller.bulkEditSave);
router.post('/suggestions',  controller.suggestions);
router.post('/inlineEdit', auth.isAuthenticated(),auth.hasRole('COMMUNITY_ADMIN'),controller.inlineEdit);
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;
