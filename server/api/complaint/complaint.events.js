/**
 * Complaint model events
 */

'use strict';

import {EventEmitter} from 'events';
import Complaint from './complaint.model';
var ComplaintEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ComplaintEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Complaint.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ComplaintEvents.emit(event + ':' + doc._id, doc);
    ComplaintEvents.emit(event, doc);
  }
}

export default ComplaintEvents;
