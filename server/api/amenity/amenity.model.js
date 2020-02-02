'use strict';

import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

var AmenitySchema = new mongoose.Schema({
    amenityId: [{
        type: Number,
        default: 1001,
        unique: true
    }],
    amenityName: String,
    description: String,
    chargePerHour: Number,
    status : { type: String, enum: ['ACTIVE', 'INACTIVE'] },
    isFreeForOwnResidents : Boolean,
    isFreeForOthers : Boolean,
    isPubliclyAccessibile : Boolean,
    contactPerson: {
        name: String,
        contactPhone: String
    },
     timeInterval :{ type: String, enum: ['hourly', '3Hours','6hours','day'] } ,
    availableBookFrom:String,
    availableBookTo:String,
    sharing : {
        canBeShared : Boolean,
        capacity : {type : Number}
    },
    adminCommunityId: Number,
    communityIds: [{communityId: String}]
});
AmenitySchema.plugin(autoIncrement.plugin, {
    model: 'Amenity',
    field: 'amenityId',
    startAt: 1,
    incrementBy: 1
});
export default mongoose.model('Amenity', AmenitySchema);
