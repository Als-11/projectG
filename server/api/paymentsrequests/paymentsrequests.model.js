'use strict';

import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

var PaymentsrequestsSchema = new mongoose.Schema({
  	paymentId : Number,
	paymentAmount : Number,
	communityId:Number,
	paymentTo : Number,//user Id to whom payment has to be made. In case of external services it will be null
	paymentDate : Date,
	communityName : String,
	customerId: Number,
	paymentName:String,
	paymentLastDate : Date, //( To track if he is crossing the deadline ) 
	raisedBy : String, //(Ex : current, milk man, phone, groceries etc.,.)
	raisedByRef : Number, //( so that we can contact  in case of any discrepancy in payments) 
	raisedOn : Date, //( For audit ) 
	recipientUserId : Number, //(user id of payment to be made)
	paymentType : {
					type:String,
					enum:['UTILITY_BILLS','MAINTENANCE', 'GROCERIES','MILK_SERVICE','WATER_SERVICE','SALARIES']
				  }, 
	isPaid : Boolean,
	paymentRecievedTransactionNo: Number,
	externalTxnRefNumber : Number, //( Like ref number given by 3rd party like elec bill etc )
	isGrievance : Boolean // ( if it is true we need to look into the comments module ) 
});

autoIncrement.initialize(mongoose.connection);
PaymentsrequestsSchema.plugin(autoIncrement.plugin, { model: 'Paymentsrequests', field: 'paymentId', startAt: 1, incrementBy: 1 });

export default mongoose.model('Paymentsrequests', PaymentsrequestsSchema);
