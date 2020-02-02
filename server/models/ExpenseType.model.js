'use strict';

import crypto from 'crypto';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import {Schema} from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

var ExpenseType = new Schema({
 expenseTypeId :Number,
 name :String,
 category : {type:String , enum:['Food', 'Clothes', 'Fuel', 'Service','Maintenance', 'House', 'Groceries','Mobile/Internet','Transportation','Others']},
 recurring : Boolean,
 recurringPeriod: {type:String,enum:['Monthly','3-Months','6-Months','12-Months']}
});
autoIncrement.initialize(mongoose.connection);
export default mongoose.model('ExpenseType', ExpenseType);
