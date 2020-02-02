'use strict';

import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

var ThreadSchema = new mongoose.Schema({
    threadId: [{
        type: Number,
        default: 1,
        unique: true
  }],
    title: String,
    description: String,
    status: String,
    communityId: Number,
    topicTitle:String,
    topicId:Number,
    userId: Number,
    active: Boolean
},{
    timestamps: true
});

ThreadSchema.plugin(autoIncrement.plugin, {
    model: 'Thread',
    field: 'threadId',
    startAt: 1,
    incrementBy: 1
});

export default mongoose.model('Thread', ThreadSchema);