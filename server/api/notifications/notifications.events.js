/**
 * Notifications model events
 */

'use strict';

import {EventEmitter} from 'events';
import Notifications from './notifications.model';
var NotificationsEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
NotificationsEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Notifications.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    NotificationsEvents.emit(event + ':' + doc._id, doc);
    NotificationsEvents.emit(event, doc);
  }
}

export default NotificationsEvents;
