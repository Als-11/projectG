'use strict';

import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

var Schema = mongoose.Schema;

var AppointmentSchema = new mongoose.Schema({
  aId : {type:Number,  default: 0, unique:true},
  serviceId : [{type : Schema.Types.ObjectId, ref : "Service"}],
  customerId : mongoose.Schema.Types.ObjectId, 
  partyId : [{type : Schema.Types.ObjectId, ref : "Party"}],
  dateFrom : Date,
  dateTo   : Date,
  comments : String,
  status   : String,
  customerPhoneNo : String,
  partyPhoneNo : String
},{
  timestamps: true
});

autoIncrement.initialize(mongoose.connection);
AppointmentSchema.plugin(autoIncrement.plugin, { model: 'Appointment', field: 'aId', startAt: 1, incrementBy: 1 });
export default mongoose.model('Appointment', AppointmentSchema);
