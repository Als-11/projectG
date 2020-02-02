'use strict';

import mongoose from 'mongoose';

var ApprovalSchema = new mongoose.Schema({
	communityId: Number,
	communityName : String,
	firstName : String,
	phoneNumber:String,
	emailId: { type : String, required : true },
	name : String,
	gender:String,
	blockName : String,
	floorNumber: Number,
    flatNumber: String,
	approvalRequestedTime : Date,
	approvalStatus :{
            type: String,
            enum: ['APPROVED', 'REJECTED','PENDING']
        },
	approvalComments : String,
	approvedBy : String
});

//validation for emailId
ApprovalSchema
	.path('emailId')
	.validate(function(emailId) {
		var _this = this; 
		var validEmail = "/^[_a-zA-Z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/";
		var flag = false;

		if(_this.emailId.length <= 5){ 
			// return false;
			flag === true;
			return;
		}
		if(flag === false){ 
			return true;	
		}
		
	}, 'Email cannot be blank');


//This is like a hook all below methods will be executed in sequences

ApprovalSchema
	.pre('save', function(next) { 
		return next();
	});	

ApprovalSchema
	.pre('save', function(next) { 
		//return next(new Error('Error in second presave'));
		return next();
	});

ApprovalSchema
	.pre('save', function(next) { 
		return next();
	});

export default mongoose.model('Approval', ApprovalSchema);