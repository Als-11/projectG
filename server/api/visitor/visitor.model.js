'use strict';

import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

var VisitorSchema = new mongoose.Schema({
    visitorId: [{
        type: Number,
        default: 1,
        unique: true
  }],
    name: String,
    phoneNumber: String,
    purpose: String,
    communityId: Number,
    blockName: String,
    floorNumber: Number,
    userId:Number,
    status:String,
    flatNo: String,
    verified: Boolean,
    vehicleNo: String,
    securityId: Number,
    securityName: String,
    inTime: Date,
    outTime: Date,
    alongWith : Number
});

VisitorSchema.plugin(autoIncrement.plugin, {
    model: 'Visitor',
    field: 'visitorId',
    startAt: 1,
    incrementBy: 1
});
export default mongoose.model('Visitor', VisitorSchema);