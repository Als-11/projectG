'use strict';

import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

var CommentSchema = new mongoose.Schema({
    commentId: [{
        type: Number,
        default: 1,
        unique: true
  }],
    threadId: Number,
    userName:String,
    complaintId:Number,
    description: String,
    isPublic:{ type: Boolean, default: true},
    userId: Number
},{
    timestamps: true
});

CommentSchema.plugin(autoIncrement.plugin, {
    model: 'Comment',
    field: 'commentId',
    startAt: 1,
    incrementBy: 1
});
export default mongoose.model('Comment', CommentSchema);