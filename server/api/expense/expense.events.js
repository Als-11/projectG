/**
 * Expense model events
 */

'use strict';

import {EventEmitter} from 'events';
import Expense from './expense.model';
var ExpenseEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ExpenseEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Expense.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ExpenseEvents.emit(event + ':' + doc._id, doc);
    ExpenseEvents.emit(event, doc);
  }
}

export default ExpenseEvents;
