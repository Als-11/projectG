'use strict';

import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

var ExpenseSchema = new mongoose.Schema({
	 expenseId : [{
        type: Number,
        default: 1001,
        unique: true
    }],
    transId:Number,
    paymentId:Number,
    anTransID:Number,
    paymentSource:String,
    payuId:Number,
    expenseReferenceNumber:Number,
 userId : Number,
 communityId: Number,
 expenseTypeId : Number,
 expenseName:String,
 expenseDate:{type:Date},
 comments: {type:String},
 status: {type:String,enum:['Paid','Pending']},
 recurring : Boolean,
 recurringPeriod: {type:String,enum:['Monthly','3-Months','6-Months','12-Months']},
 recurringDate: {type:Date},
 expenseAmount :Number


});
ExpenseSchema.plugin(autoIncrement.plugin, {
    model: 'Expense',
    field: 'expenseId',
    startAt: 1,
    incrementBy: 1
});
export default mongoose.model('Expense', ExpenseSchema);
