'use strict';

import mongoose from 'mongoose';

var UserServProvRegistSchema = new mongoose.Schema({
  serviceProviderId : Number,
  communityId : Number,
  consumerUserId : Number,
  serviceId : Number,
  registeredOn : Date,
  expiredOn : Date,
  isActive : Boolean
});

export default mongoose.model('UserServProvRegist', UserServProvRegistSchema);
