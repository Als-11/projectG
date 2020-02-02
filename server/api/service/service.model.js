'use strict';

import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

var ServiceSchema = new mongoose.Schema({
  serviceId:Number,
  serviceName: String,
  serviceDesc : String,
  serviceCategory : String,
  active:Boolean,
  communityId:Number
});






autoIncrement.initialize(mongoose.connection);
ServiceSchema.plugin(autoIncrement.plugin, { model: 'Service', field: 'serviceId', startAt: 1, incrementBy: 1 });
export default mongoose.model('Service', ServiceSchema);
