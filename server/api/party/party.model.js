'use strict';

import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

var PartySchema = new mongoose.Schema({
  pId : {type:Number,  default: 0, unique:true},
  firstName: String,
  lastName: String,
  mobileNumber : String,
  emaiId : String,
  serviceIds :{type:String, default :[]},
  address:{
      address1 : String,
      address2 : String,
      locality : String,
      landmark : String     
  },    
  city:String, 
  pincode:String,
  active: Boolean
});

autoIncrement.initialize(mongoose.connection);
PartySchema.plugin(autoIncrement.plugin, { model: 'Party', field: 'pId', startAt: 1, incrementBy: 1 });

export default mongoose.model('Party', PartySchema);
