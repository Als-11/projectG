/**
 * TypesForService model events
 */

'use strict';

import {EventEmitter} from 'events';
import TypesForService from './typesForService.model';
var TypesForServiceEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
TypesForServiceEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  TypesForService.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    TypesForServiceEvents.emit(event + ':' + doc._id, doc);
    TypesForServiceEvents.emit(event, doc);
  };
}

export default TypesForServiceEvents;
