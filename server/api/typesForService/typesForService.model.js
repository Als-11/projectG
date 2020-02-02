'use strict';

import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
var TypesForServiceSchema = new mongoose.Schema({
  typeId : String,
  serviceId : Number,
  serviceName:String,
  brandName : String,
  description : String,
  serviceProviderId:Number,
  isActive : Boolean,
  unitPrice : Number,
  quantity : String
});


autoIncrement.initialize(mongoose.connection);
TypesForServiceSchema.plugin(autoIncrement.plugin, { model: 'TypesForService', field: 'typeId', startAt: 1, incrementBy: 1 });
export default mongoose.model('TypesForService', TypesForServiceSchema);
