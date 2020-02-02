'use strict';

import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';


var NotificationsSchema = new mongoose.Schema({
 notificationId : {type:Number,unique:true},
  title:String,
  description:String,
  communityId:Number,
  isPoll:Boolean,
  isRead:Boolean,
  userId:Number,
  notificationuniqueId:Number,
  isResponded:String,
  approvedUsers: [{
  	userId:[],
  }],
    declinedUsers: [{
  	userId:[],
  }],
  maybeusers:[{	
  	userId:[],
  }],
  createdBy:String
}, {
    timestamps: true
});

autoIncrement.initialize(mongoose.connection);
NotificationsSchema.plugin(autoIncrement.plugin, { model: 'Notifications', field: 'notificationId', startAt: 1, incrementBy: 1 });

export default mongoose.model('Notifications', NotificationsSchema);
