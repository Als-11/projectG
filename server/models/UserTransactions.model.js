'use strict';

import crypto from 'crypto';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import {Schema} from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

var UserTransactions = new Schema({
  transactionId: Number,
  userId: Number,
  serviceId: Number,
  billAmount: Number,
  billMonth: Date,
  billDate: Date,
  fetchDate: Date,
  status: String,
  errorCode: String,
  errorMessage: String,
  acknowledgeId: String
});


UserTransactions.plugin(autoIncrement.plugin, { model: 'UserTransactions', field: 'transactionId', startAt: 1, incrementBy: 1 });
export default mongoose.model('UserTransactions', UserTransactions);
