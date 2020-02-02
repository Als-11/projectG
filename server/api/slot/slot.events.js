/**
 * Slot model events
 */

'use strict';

import {EventEmitter} from 'events';
import Slot from './slot.model';
var SlotEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
SlotEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Slot.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    SlotEvents.emit(event + ':' + doc._id, doc);
    SlotEvents.emit(event, doc);
  }
}

export default SlotEvents;
