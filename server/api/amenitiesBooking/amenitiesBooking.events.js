/**
 * AmenitiesBooking model events
 */

'use strict';

import {EventEmitter} from 'events';
import AmenitiesBooking from './amenitiesBooking.model';
var AmenitiesBookingEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
AmenitiesBookingEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  AmenitiesBooking.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    AmenitiesBookingEvents.emit(event + ':' + doc._id, doc);
    AmenitiesBookingEvents.emit(event, doc);
  }
}

export default AmenitiesBookingEvents;
