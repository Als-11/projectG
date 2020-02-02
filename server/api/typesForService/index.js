'use strict';

var express = require('express');
var controller = require('./typesForService.controller');
import * as auth from '../../auth/auth.service';
var router = express.Router();

router.post('/addBrand',auth.isAuthenticated(),auth.hasRole('SERVICE_PROVIDER'), controller.save);
router.post('/userSelSertype',auth.isAuthenticated(),controller.userSelSertype);
router.get('/getBrand',auth.isAuthenticated(),controller.getBrand);
router.get('/getBrandCount',auth.isAuthenticated(),auth.hasRole('SERVICE_PROVIDER'),controller.getBrandCount);

// router.get('/:id', controller.show);
// router.post('/',auth.isAuthenticated(),auth.hasRole('SERVICE_PROVIDER'), controller.create);
// router.put('/:id', controller.upsert);
// router.patch('/:id', controller.patch);
// router.delete('/:id', controller.destroy);

module.exports = router;
