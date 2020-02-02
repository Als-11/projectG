'use strict';

import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

var ServiceProviderDetailSchema = new mongoose.Schema({
    serviceProviderId : {type:Number,unique:true},
    userId : Number,
    community: [{
            communityId: Number,
    }],
    brands:[{
        serviceCategory:String,
         brandId:[]
    }],
    firstName : String,
    lastName : String,
    companyName : String,
    emailId:{type:String},
    landlineNumber:Number,
    mobileNumber:Number,
    address : String,
    companyInfo:String,
   
});

autoIncrement.initialize(mongoose.connection);
ServiceProviderDetailSchema.plugin(autoIncrement.plugin, { model: 'ServiceProviderDetail', field: 'serviceProviderId', startAt: 1, incrementBy: 1 });
export default mongoose.model('ServiceProviderDetail', ServiceProviderDetailSchema);
