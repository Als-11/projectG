'use strict';

import * as auth from '../../auth/auth.service';

var express = require('express');
var controller = require('./billservice.controller');

var router = express.Router();

router.get('/getservice', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.post('/userSelectedCategory', auth.isAuthenticated(), controller.userSelectedCategory);
router.post('/userSelectedoperator', auth.isAuthenticated(), controller.userSelectedoperator);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
