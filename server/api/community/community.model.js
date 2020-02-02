'use strict';

import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import uniqueValidator from 'mongoose-unique-validator';

var CommunitySchema = new mongoose.Schema({
    active: Boolean,
    communityName: String,
    emailId: { type : String , unique : true, required : true },
    emailVerified: { type : Boolean, default : false},
    // phoneNumber :{
    //     countryCode : String,
    //     number : String
    // },
    phoneNumber:String,
    communityId: [{
        type: Number,
        default: 1001,
        unique: true
    }],
    maintenanceCost:Number,
    maintenanceDate :Number,
    address: { 
        address1: String,
        address2: String,
        locality: String,
        landmark: String,
        city: String,
        pincode: String
    },
    latValue:Number,
    longValue :Number,
    blocks: [{
        blockName: String,
        floors: [{
            floorNumber: Number,
            flatNumbers: [String]
    }]
}],

securityLevel: {
        type:String,
        enum:['STRICT', 'MODERATE', 'EASY']
    },

    amenities: [{
        amenityName: String,
        description: String,
        chargePerHour: Number,
        contactPerson: {
            name: String,
            contactPhone: String
        },
        canBeShared: Boolean
}],

    staff: [{
        staffName: String,
        category: String,
        typeOfStaff: {
            type: String,
            enum: ['PERMANENT', 'CONTRACT']
        },
        workingHours: {
            startTime: Date,
            endTime: Date,
        },
        contactNumber: String,
        address: {
            address1: String,
            address2: String,
            locality: String,
            landmark: String,
            city: String,
            pincode: String
        }
}],
    bankDetails: {
        accountNumber: String,
        beneficiaryName: String,
        bankName: String,
        branchName: String,
        IFSC: String
    }


});
autoIncrement.initialize(mongoose.connection);
CommunitySchema.plugin(autoIncrement.plugin, {
    model: 'Community',
    field: 'communityId',
    startAt: 1001,
    incrementBy: 1
});

CommunitySchema.plugin(uniqueValidator, { message: 'The specified email address {VALUE} is already in use.' });
export default mongoose.model('Community', CommunitySchema);
