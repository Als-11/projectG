'use strict';

var express = require('express');
var controller = require('./slot.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:sid/:date', controller.show);
router.get('/:sid/:date/:slot', controller.findSlot);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
