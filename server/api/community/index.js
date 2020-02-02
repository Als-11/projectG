'use strict';

var express = require('express');
var controller = require('./community.controller');
import * as auth from '../../auth/auth.service';
var router = express.Router();

router.get('/getLatLong',controller.getLatLong);//getting lat & long values;
router.post('/suggestions', controller.getSuggestions);
router.get('/getcommunity',auth.isAuthenticated(),controller.communitiesInfo);//communityinfo(serviceprovider dashboard)
router.get('/mail', controller.mail);
router.get('/getCommunityInfo',auth.isAuthenticated(),controller.getCommunityInfo);//superAdmin
router.post('/changeLatLong',auth.isAuthenticated(),controller.changeLatLong);//change lat and long values(communityAdmin)
router.get('/blocks/',auth.isAuthenticated(),controller.getBlocks);
router.post('/maintenanceInfo',auth.isAuthenticated(),controller.maintenanceInfo);
router.post('/getCommunityBlocks',controller.getSelectedBlocks);
router.post('/populateResident', controller.populateResident);//getting residents in Selected Block
// router.get('/', controller.index);
// router.get('/:id', controller.show);
router.post('/setSecurityLevel',auth.isAuthenticated(), controller.setSecurityLevel);
router.post('/getusersCount',auth.isAuthenticated(), controller.getusersCount);
router.post('/', controller.create);
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
router.delete('/floors',controller.deleteFloors);
router.delete('/blocks',controller.deleteBlock);
// router.delete('/:id', controller.destroy);

// CRUD for blocks 
router.post('/blocks',controller.addBlock);


//CRUD for floors

router.post('/floors',controller.addFloors);


module.exports = router;
