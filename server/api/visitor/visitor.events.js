/**
 * Visitor model events
 */

'use strict';

import {EventEmitter} from 'events';
import Visitor from './visitor.model';
var VisitorEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
VisitorEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove',
  'create': 'create'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Visitor.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) { 
    VisitorEvents.emit('visitor:' + event, doc);
    VisitorEvents.emit(event, doc);
  }
}

export default VisitorEvents;
