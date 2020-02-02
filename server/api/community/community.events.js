/**
 * Community model events
 */

'use strict';

import {EventEmitter} from 'events';
import Community from './community.model';
var CommunityEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CommunityEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Community.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    CommunityEvents.emit(event + ':' + doc._id, doc);
    CommunityEvents.emit(event, doc);
  }
}

export default CommunityEvents;
