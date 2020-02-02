/**
 * ServiceRequest model events
 */

'use strict';

import {EventEmitter} from 'events';
import ServiceRequest from './serviceRequest.model';
var ServiceRequestEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ServiceRequestEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  ServiceRequest.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ServiceRequestEvents.emit(event + ':' + doc._id, doc);
    ServiceRequestEvents.emit(event, doc);
  };
}

export default ServiceRequestEvents;
