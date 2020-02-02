'use strict';

import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

var Schema = mongoose.Schema;

var CustomerSchema = new mongoose.Schema({
  cId : {type:Number,  default: 0, unique:true},
  apartmentId :  [{type : Schema.Types.ObjectId, ref : "Apartment"}],
  apartmentBlockId : [{type : Schema.Types.ObjectId, ref : "Apartment.blocks"}],
  firstName: String,
  lastName: String,
  mobileNumber : String,
  emailId : String,
  Address : String,
  active: Boolean
    
});

autoIncrement.initialize(mongoose.connection);
CustomerSchema.plugin(autoIncrement.plugin, { model: 'Customer', field: 'cId', startAt: 1, incrementBy: 1 });

export default mongoose.model('Customer', CustomerSchema);
