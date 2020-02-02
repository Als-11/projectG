'use strict';

import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

var ComplaintSchema = new mongoose.Schema({
    complaintId: [{
        type: Number,
        default: 1001,
        unique: true
  }],
    communityId: Number,
    userName:String,
    title: String,
    complaintdescription: String,
    category: String,
    userId: Number,
    status: {
        type: String,
        enum: ['Open', 'Closed', 'Assigned', 'Hold', 'Resolved','Pending','Rejected']
    },
    assigned: String,
    assignedId:Number,
    employeeId:String

}, {
    timestamps: true
});

ComplaintSchema.plugin(autoIncrement.plugin, {
    model: 'Complaint',
    field: 'complaintId',
    startAt: 1,
    incrementBy: 1
});



export default mongoose.model('Complaint', ComplaintSchema);