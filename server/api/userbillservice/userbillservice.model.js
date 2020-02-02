'use strict';

import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

var UserbillserviceSchema = new mongoose.Schema({
  userbillserviceId : {type:Number,  default: 0, unique:true},
  billServiceId: String,
  operator:String,
  uniqueId: String,
  userId: Number,
  communityId: Number,
  Category:String
});

autoIncrement.initialize(mongoose.connection);
UserbillserviceSchema.plugin(autoIncrement.plugin, { model: 'Userbillservice',field: 'userbillserviceId', startAt: 1, incrementBy: 1 });
export default mongoose.model('Userbillservice', UserbillserviceSchema);
