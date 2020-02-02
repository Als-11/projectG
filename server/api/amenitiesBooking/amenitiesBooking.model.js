 'use strict';

import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';


var AmenitiesBookingSchema = new mongoose.Schema({    
    amenityId : {type : Number},
    communityId:{type: Number},
    tags : [String] ,
    date:{type:Date},
    category : String, 
    bookingId: [{
        type: Number,
        default: 1001,
        unique: true
    }],
    approvalStatus : { type: String, enum: ['APPROVED', 'REJECTED','PENDING'] } ,
    approvedBy : {type : Number},
    approvedOn : { type : Date} ,
    approvalComments : String ,
    requestorComments :  String, 
     rejectedOn:{type:Date},
    blockedBy : Number,
    blockedOn : { type : Date },
    blockedFrom : { type : Date },
    blockedTo : { type : Date }     
        
});

autoIncrement.initialize(mongoose.connection);
AmenitiesBookingSchema.plugin(autoIncrement.plugin, {
    model: 'AmenitiesBooking',
    field: 'bookingId',
    startAt: 1001,
    incrementBy: 1
});


export default mongoose.model('AmenitiesBooking', AmenitiesBookingSchema);
