'use strict';

import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

var TopicSchema = new mongoose.Schema({
    topicId: [{
        type: Number,
        default: 1,
        unique: true
  }],
    title: String,
    description: String,
    communityId:Number,
    active: Boolean
}, {
    timestamps: true
});

TopicSchema.plugin(autoIncrement.plugin, {
    model: 'Topic',
    field: 'topicId',
    startAt: 1,
    incrementBy: 1
});
export default mongoose.model('Topic', TopicSchema);