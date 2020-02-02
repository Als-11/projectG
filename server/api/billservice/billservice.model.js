'use strict';

import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

var BillServiceSchema = new mongoose.Schema({
  billServiceId : {type:Number,  default: 0, unique:true},
  name: String,
  info: String,
  provider: String,
  opCode: String,
  category: {
    type: String, enum: ['Prepaid', 'Postpaid', 'DTH', 'Electricity', 'Gas','Data Card']
  }
});

autoIncrement.initialize(mongoose.connection);
BillServiceSchema.plugin(autoIncrement.plugin, { model: 'BillService',field: 'billServiceId', startAt: 1, incrementBy: 1 });
export default mongoose.model('BillService', BillServiceSchema);
