'use strict';

import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

var ServiceRequestSchema = new mongoose.Schema({
  servRequestId : Number,
  serviceId : Number,
  communityId : Number,
  serviceProviderId : Number,
  consumerUserId : Number,
  consumerBlock : String,
  consumerFloor : Number,
  deliveryDate : Date,
servicecategory:String,
  price:Number,
  serviceTypeName:String,
  units : Number,
  customTypeId : Number,
  status : String, // can be enum PENDING,ACCECPTED,DELIVERED,REJECTED,OPEN_ISSUE
  serviceClosureComments : String,
  customerIssueComments : String,
  comments : String //This can be used when a customer reopens a request due to any issue.
});


autoIncrement.initialize(mongoose.connection);
ServiceRequestSchema.plugin(autoIncrement.plugin, { model: 'ServiceRequest', field: 'servRequestId', startAt: 1, incrementBy: 1 });
export default mongoose.model('ServiceRequest', ServiceRequestSchema);
