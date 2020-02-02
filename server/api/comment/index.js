'use strict';

var express = require('express');
var controller = require('./comment.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.post('/getPagination',controller.getPagination);
router.post('/previousThreadComments',controller.previousThreadComments);
router.post('/previousThreadskipComments',controller.previousThreadskipComments);
router.post('/createThreadComment',controller.createThreadComment);
router.post('/commentsCreate', controller.commentsCreate);
router.post('/commentsHistory', controller.commentsHistory);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
module.exports = router;
