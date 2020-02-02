'use strict';

var express = require('express');
var controller = require('./thread.controller');

var router = express.Router();


// router.get('/generalDiscussionsCounts', controller.generalDiscussionsCounts);
// router.get('/eventsCount', controller.events);
// router.get('/buyingCount', controller.buying);
router.get('/Counts', controller.Counts);
router.post('/', controller.index);
router.post('/deleteThread',controller.deleteThread);
router.get('/:id', controller.show);
// router.get('/', controller.generalDiscussionsCounts);
// 
router.post('/addYourThread', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
