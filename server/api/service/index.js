'use strict';

var express = require('express');
var controller = require('./service.controller');
import * as auth from '../../auth/auth.service';
var router = express.Router();

router.get('/getServices',auth.isAuthenticated(), controller.getServices);
// router.post('/getServiceId',controller.getServiceId);
router.post('/add',controller.add);
router.get('/', controller.get);
router.post('/servDetails',auth.isAuthenticated(),controller.servDetails);
// router.get('/:id', controller.show);
// router.post('/', controller.create);
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;
