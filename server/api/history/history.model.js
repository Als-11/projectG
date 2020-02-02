'use strict';

import mongoose from 'mongoose';

var HistorySchema = new mongoose.Schema({
  userId:Number,
  userInfoId:Number,
  complaintId: Number,
  text:String,
  comment:String,
  createdAt:Date
});

export default mongoose.model('History', HistorySchema);
