/**
 * Thread model events
 */

'use strict';

import {EventEmitter} from 'events';
import Thread from './thread.model';
var ThreadEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ThreadEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Thread.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ThreadEvents.emit(event + ':' + doc._id, doc);
    ThreadEvents.emit(event, doc);
  }
}

export default ThreadEvents;
