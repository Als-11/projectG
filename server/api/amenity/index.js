'use strict';

var express = require('express');
import * as auth from '../../auth/auth.service';
var controller = require('./amenity.controller');

var router = express.Router();
// router.post('/addcommunity/:id',controller.addCommunity);
router.post('/create',auth.isAuthenticated(),controller.create);
router.post('/getAmenityDetail',auth.isAuthenticated(),controller.getAmenityDetail);
router.get('/getAmenityNames',auth.isAuthenticated(),controller.getAmenityNames);
router.get('/redirectUser',auth.isAuthenticated(),controller.redirectUser);
// router.get('/', controller.index);
// router.get('/:id', controller.show);
router.post('/',auth.isAuthenticated(), controller.create);
router.post('/deleteAmenity',auth.isAuthenticated(),controller.deleteAmenity);
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);
module.exports = router;
