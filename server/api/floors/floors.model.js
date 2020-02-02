'use strict';

import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

var FloorsSchema = new mongoose.Schema({
	 floorId: [{
        type: Number,
        default: 1001,
        unique: true
    }],
 communityId:Number,
 blockName:String,
 houseNumber:String,
 maintenanceCost:Number,
 maintenanceDate :Number,
 flatNumber:String,
 floorNumber:Number,
 flatType:String
});

FloorsSchema.plugin(autoIncrement.plugin, {
    model: 'Floors',
    field: 'floorId',
    startAt: 1001,
    incrementBy: 1
});
export default mongoose.model('Floors', FloorsSchema);