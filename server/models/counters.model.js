'use strict';

import crypto from 'crypto';
import mongoose from 'mongoose';
// mongoose.Promise = require('bluebird');
import {Schema} from 'mongoose';

var Counters = new Schema({
  _id: String,
  seq: Number
});

export default mongoose.model('Counters', Counters);
