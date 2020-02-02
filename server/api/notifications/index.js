'use strict';

var express = require('express');
var controller = require('./notifications.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();
router.get('/unreadcount',auth.isAuthenticated(), controller.unReadcount);//unread notifications count to show on the bell icon
router.get('/getEnvelopNotification', auth.isAuthenticated(),controller.getEnvelopNotification);//unread notifications count to show on the bell icon
router.get('/getNotification',auth.isAuthenticated(), controller.getNotification);
router.get('/readNotification',auth.isAuthenticated(), controller.readNotification);
router.get('/markAllRea', auth.isAuthenticated(),controller.markAllRead);
router.post('/saveNotification',auth.isAuthenticated(), controller.saveNotification);
router.post('/doaction',auth.isAuthenticated(), controller.doaction);   //action like approve,decline
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;
