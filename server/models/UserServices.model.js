'use strict';

import crypto from 'crypto';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import {Schema} from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

var UserServices = new Schema({
  eProviderId: String,
  eUniqueId: String,
  userId: Number
});

UserServices.plugin(autoIncrement.plugin, 'UserServices');
export default mongoose.model('UserServices', UserServices);
