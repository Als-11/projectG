'use strict';

import crypto from 'crypto';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import {Schema} from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

var ElectricityProviders = new Schema({
  providerName: String,
  providerState: String,
  providerUrl: String,
  labelName: String,
  isBillFetchable: Boolean 
});

ElectricityProviders.plugin(autoIncrement.plugin, 'ElectricityProviders');
export default mongoose.model('ElectricityProviders', ElectricityProviders);
