'use strict';

var express = require('express');
var controller = require('./amenitiesBooking.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();
router.get('/latestBooking', auth.isAuthenticated(), controller.latestBooking);  //admin(list of bookings)
router.get('/bookingHistory',  auth.isAuthenticated(),controller.bookingHistory);  //user (bookinghistory)
router.post('/amenityApproved', auth.isAuthenticated(),controller.amenityApproved);
router.post('/amenityDeclined', auth.isAuthenticated(),controller.amenityDeclined);
// router.get('/', controller.index);
// router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(),controller.create);
router.post('/getBookings',auth.isAuthenticated(),controller.getBookings);
router.post('/bookingAmenity',auth.isAuthenticated(),controller.makeBooking);
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;
