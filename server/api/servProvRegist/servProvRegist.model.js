'use strict';

import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

var ServProvRegistSchema = new mongoose.Schema({
    serProRegistId : {type:Number,unique:true},
  serviceProviderId : Number,
  serviceId : Number,
  communityId:Number,
  isActive : Boolean,
  approvalRequestedTime : Date,
  approvalStatus :{
    type: String,
    enum: ['APPROVED', 'REJECTED','PENDING']},
  approvalComments : String,
  approvedBy : String,
  approvedOn : Date,
  types : [{
    typeId : Number,// To get name and desc from seed data
    isApproved : Boolean,
    serviceCategoryId:Number    //to get the provider selected category id number
    }]
});


autoIncrement.initialize(mongoose.connection);
ServProvRegistSchema.plugin(autoIncrement.plugin, { model: 'ServProvRegist', field: 'serProRegistId', startAt: 1, incrementBy: 1 });
export default mongoose.model('ServProvRegist', ServProvRegistSchema);
