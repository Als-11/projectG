/**
 * Floors model events
 */

'use strict';

import {EventEmitter} from 'events';
import Floors from './floors.model';
var FloorsEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
FloorsEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Floors.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    FloorsEvents.emit(event + ':' + doc._id, doc);
    FloorsEvents.emit(event, doc);
  }
}

export default FloorsEvents;
