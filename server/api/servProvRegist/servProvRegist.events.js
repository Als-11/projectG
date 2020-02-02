/**
 * ServProvRegist model events
 */

'use strict';

import {EventEmitter} from 'events';
import ServProvRegist from './servProvRegist.model';
var ServProvRegistEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ServProvRegistEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  ServProvRegist.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ServProvRegistEvents.emit(event + ':' + doc._id, doc);
    ServProvRegistEvents.emit(event, doc);
  };
}

export default ServProvRegistEvents;
