'use strict';

import mongoose from 'mongoose';
var Schema = mongoose.Schema;
import autoIncrement from 'mongoose-auto-increment';

var SlotSchema = new mongoose.Schema({
  slotId    : Number, // 1,2,3,4 
  timeFrom  : Date,   // 10:00             
  timeTo    : Date   // 11:00
//  sid       : [{type : Schema.Types.ObjectId, ref : "Service"}],
//  pid       : [{type : Schema.Types.ObjectId, ref : "Party"}],
},{
  timestamps: true
});
SlotSchema.index({date: 1, sid: 1});
export default mongoose.model('Slot', SlotSchema);
