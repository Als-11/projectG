/**
 * History model events
 */

'use strict';

import {EventEmitter} from 'events';
import History from './history.model';
var HistoryEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
HistoryEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  History.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    HistoryEvents.emit(event + ':' + doc._id, doc);
    HistoryEvents.emit(event, doc);
  }
}

export default HistoryEvents;
