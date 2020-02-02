/**
 * Apartment model events
 */

'use strict';

import {EventEmitter} from 'events';
import Apartment from './apartment.model';
var ApartmentEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ApartmentEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Apartment.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ApartmentEvents.emit(event + ':' + doc._id, doc);
    ApartmentEvents.emit(event, doc);
  }
}

export default ApartmentEvents;
