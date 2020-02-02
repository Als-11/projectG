/**
 * ServiceProviderDetail model events
 */

'use strict';

import {EventEmitter} from 'events';
import ServiceProviderDetail from './serviceProviderDetail.model';
var ServiceProviderDetailEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ServiceProviderDetailEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  ServiceProviderDetail.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ServiceProviderDetailEvents.emit(event + ':' + doc._id, doc);
    ServiceProviderDetailEvents.emit(event, doc);
  };
}

export default ServiceProviderDetailEvents;
