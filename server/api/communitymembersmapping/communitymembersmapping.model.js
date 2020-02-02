'use strict';

import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

var CommunitymembersmappingSchema = new mongoose.Schema({
	communitymemberId: [{
        type: Number,
        default: 1001,
        unique: true
    }],
    userId:Number,
   communityId:Number,
   name:String,
   emailId: { type : String , unique : true, required : true },
   phoneNumber:String,
   fromDate:{type:Date},
   toDate:{type:Date},
   roleId:{type:String},
   roleType:{type:String,enum: ['Secretary', 'JointSecretary','Treasurer','CommunityMembers']}
});
CommunitymembersmappingSchema.plugin(autoIncrement.plugin, {
    model: 'Communitymembersmapping',
    field: 'communitymemberId',
    startAt: 1,
    incrementBy: 1
});

export default mongoose.model('Communitymembersmapping', CommunitymembersmappingSchema);
