'use strict';

import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

var ApartmentSchema = new mongoose.Schema({
  apartmentId :[{type:Number,  default: 1001, unique:true}],
  name: String,
  active: Boolean,
  address:{
      address1 : String,
      address2 : String,
      locality : String,
      landmark : String     
  },    
  city:String, 
  pincode:String,
  blocks:[{
      name:String,
      floors:[{
          floorNumber:Number,
          flatNumbers:[]
      }]
  }]
});

ApartmentSchema.plugin(autoIncrement.plugin, { model: 'Apartment', field: 'apartmentId', startAt: 1001, incrementBy: 1 });
export default mongoose.model('Apartment', ApartmentSchema);
