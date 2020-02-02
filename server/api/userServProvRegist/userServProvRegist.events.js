/**
 * UserServProvRegist model events
 */

'use strict';

import {EventEmitter} from 'events';
import UserServProvRegist from './userServProvRegist.model';
var UserServProvRegistEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
UserServProvRegistEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  UserServProvRegist.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    UserServProvRegistEvents.emit(event + ':' + doc._id, doc);
    UserServProvRegistEvents.emit(event, doc);
  };
}

export default UserServProvRegistEvents;
