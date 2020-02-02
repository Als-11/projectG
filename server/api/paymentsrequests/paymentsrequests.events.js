/**
 * Paymentsrequests model events
 */

'use strict';

import {EventEmitter} from 'events';
import Paymentsrequests from './paymentsrequests.model';
var PaymentsrequestsEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PaymentsrequestsEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Paymentsrequests.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    PaymentsrequestsEvents.emit(event + ':' + doc._id, doc);
    PaymentsrequestsEvents.emit(event, doc);
  };
}

export default PaymentsrequestsEvents;
