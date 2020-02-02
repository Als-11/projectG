/**
 * Amenity model events
 */

'use strict';

import {EventEmitter} from 'events';
import Amenity from './amenity.model';
var AmenityEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
AmenityEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Amenity.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    AmenityEvents.emit(event + ':' + doc._id, doc);
    AmenityEvents.emit(event, doc);
  }
}

export default AmenityEvents;
