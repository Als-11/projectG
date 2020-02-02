/**
 * Party model events
 */

'use strict';

import {EventEmitter} from 'events';
import Party from './party.model';
var PartyEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PartyEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Party.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    PartyEvents.emit(event + ':' + doc._id, doc);
    PartyEvents.emit(event, doc);
  }
}

export default PartyEvents;
