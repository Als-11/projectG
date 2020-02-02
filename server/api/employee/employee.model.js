'use strict';

import mongoose from 'mongoose';
var EmployeeSchema = new mongoose.Schema({
	name:String,
	info: String,
    active: Boolean,
	gender: String,
  email: {
    type: String,
    lowercase: true
  }, 
	employeeId: String,
  communityId:Number,
	fromDate:{ type:Date},
    salary:String,
    salaryDate:{type:Date},
    toDate:{ type:Date},
    employeeType:{type:String,enum:['SECURITY','CARPENTRY','GARDENING','ELECTRICIAN','PLUMBER','OTHERS']},
    firstName: String,
  	lastName: String,
  	phoneNumber:String,
  	userId: {type:Number}
});
export default mongoose.model('Employee', EmployeeSchema);
