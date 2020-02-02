  'use strict';

  import crypto from 'crypto';
  import mongoose from 'mongoose';
  mongoose.Promise = require('bluebird');
  import { Schema } from 'mongoose';
  import autoIncrement from 'mongoose-auto-increment';

  const authTypes = ['github', 'twitter', 'facebook', 'google'];
  var MAX_LOGIN_ATTEMPTS = 5,
      LOCK_TIME = 60 * 1000;

  var person;
  var UserSchema = new Schema({
      userId: { type: Number, default: 0, unique: true },
      communityId: { type: Number },
      firstName: String,
      lastName: String,
      Gender: String,
      EmployeeId: String,
      houseNumber: String,
      cid: Number,
      floorId:Number,
      email: {
          type: String,
          lowercase: true
      },
      serviceProviderId: Number,
      phoneNumber: String,
      role: {
          type: String,
          enum: ['CUSTOMER', 'PARTY', 'COMMUNITY_ADMIN', 'COMMUNITY_MEMBER', 'RESIDENT', 'EMPLOYEE', 'SERVICE_PROVIDER','GUWHA_EMPLOYEE', 'SUPER_ADMIN']
      },
      blockName:String,
      flatNumber:String,
      occupation: String,
      password: String,
      provider: String,
      salt: String,
      facebook: {},
      twitter: {},
      google: {},
      github: {},
      gender: String,
      employeeType: { type: String, enum: ['SECURITY', 'CARPENTRY', 'GARDENING', 'ELECTRICIAN', 'PLUMBER', 'OTHERS'] },
      fromDate: { type: Date },
      salary: String,
      salaryDate: { type: Date },
      toDate: { type: Date },
      operator: String,
      dob: Date,
      anniversary: Date,
      imageUrl:String,
      // role: {type: String, enum: ['CUSTOMER', 'PARTY']},
      customerId: [{ type: Schema.Types.ObjectId, ref: "Customer" }],
      partyId: [{ type: Schema.Types.ObjectId, ref: "Party" }],
      location: {
          type: String,
          coordinates: { x: String, y: String }
      },
      loginAttempts: { type: Number, required: true, default: 0 },
      lockUntil: { type: Number },
      status: { type: String }

  }
  );



  

  /**
   * Virtuals
   */

  // Public profile information
  UserSchema
      .virtual('profile')
      .get(function() {
          return {
              'name': this.name,
              'role': this.role
          };
      });

  // Non-sensitive info we'll be putting in the token
  UserSchema
      .virtual('token')
      .get(function() {
          return {
              '_id': this._id,
              'role': this.role
          };
      });



  /**
   * Validations
   */

  // Validate empty email
  UserSchema
      .path('email')
      .validate(function(email) {
          if (authTypes.indexOf(this.provider) !== -1) {
              return true;
          }
          return email.length;
      }, 'Email cannot be blank');

  // Validate empty password
  UserSchema
      .path('password')
      .validate(function(password) {
          if (authTypes.indexOf(this.provider) !== -1) {
              return true;
          }
          return password.length;
      }, 'Password cannot be blank');

  // Validate email is not taken
  UserSchema
      .path('email')
      .validate(function(value, respond) {
          var self = this;
          return this.constructor.findOne({ email: value }).exec()
              .then(function(user) {
                  if (user) {
                      if (self.id === user.id) {
                          return respond(true);
                      }
                      return respond(false);
                  }
                  return respond(true);
              })
              .catch(function(err) {
                  throw err;
              });
      }, 'The specified email address is already in use.');

  var validatePresenceOf = function(value) {
      return value && value.length;
  };

  /**
   * Pre-save hook
   */
  UserSchema
      .pre('save', function(next) {
          // Handle new/update passwords
          if (!this.isModified('password')) {
              return next();
          }

          if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1) {
              return next(new Error('Invalid password'));
          }

          // Make salt with a callback
          this.makeSalt((saltErr, salt) => {
              if (saltErr) {
                  return next(saltErr);
              }
              this.salt = salt;
              this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
                  if (encryptErr) {
                      return next(encryptErr);
                  }
                  this.password = hashedPassword;
                  next();
              });
          });
      });

  /**
   * Methods
   */
  UserSchema.methods = {
      /**
       * Authenticate - check if the passwords are the same
       *
       * @param {String} password
       * @param {Function} callback
       * @return {Boolean}
       * @api public
       */
      authenticate( user,password,callback) {
          // This is a temporary fix, as we are not creating any user
          // using the UI
          //callback(null, true);
          console.log("hello");
          console.log(this.password);
          person = user;


          if (!callback) {
              return this.password === this.encryptPassword(password);
          }

          this.encryptPassword(password, (err, pwdGen) => {
              if (err) {
                  return callback(err);
              }


              if (this.password === pwdGen) {

                  if (person.lockUntil < Date.now()) {
                      this.constructor.update({ email: user.email }, {
                          $set: {
                              loginAttempts: 0,
                              status: "unlocked",
                              lockUntil: 0
                          }
                      }).exec()
                      callback(null, true);
                  } else {
                      callback(null, false); //Block we should block user even after 6th attempt for a minute
                  }
              } else {
                  // callback(null, false);

                  // check if the account is currently locked

                  // saying that locktime is still active
                  if (person.lockUntil > Date.now()) {
                      callback(null, false);

                  } else { // find user and update loginattempts and lockuntill values
                      this.constructor.update({ email: user.email }, { $set: { loginAttempts: user.loginAttempts + 1 } }).exec()
                      callback(null, false);
                      if (user.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS) {
                          this.constructor.update({ email: user.email }, {
                              $set: {
                                  lockUntil: Date.now() + LOCK_TIME,
                                  loginAttempts: 0,
                                  status: "Temporaryly Locked"
                              },
                              safe: true
                          }).exec()
                      }
                  }
              }

          });
      },

      /**
       * Make salt
       *
       * @param {Number} byteSize Optional salt byte size, default to 16
       * @param {Function} callback
       * @return {String}
       * @api public
       */
      makeSalt(byteSize, callback) {
          var defaultByteSize = 16;

          if (typeof arguments[0] === 'function') {
              callback = arguments[0];
              byteSize = defaultByteSize;
          } else if (typeof arguments[1] === 'function') {
              callback = arguments[1];
          }

          if (!byteSize) {
              byteSize = defaultByteSize;
          }

          if (!callback) {
              return crypto.randomBytes(byteSize).toString('base64');
          }

          return crypto.randomBytes(byteSize, (err, salt) => {
              if (err) {
                  callback(err);
              } else {
                  callback(null, salt.toString('base64'));
              }
          });
      },

      /**
       * Encrypt password
       *
       * @param {String} password
       * @param {Function} callback
       * @return {String}
       * @api public
       */
      encryptPassword(password, callback) {
          var mail = this.email;
          if (!password || !this.salt) {
              return null;
          }

          var defaultIterations = 10000;
          var defaultKeyLength = 64;
          var salt = new Buffer(this.salt, 'base64');

          if (!callback) {
              return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength)
                  .toString('base64');
          }

          return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, (err, key) => {
              if (err) {
                  callback(err);
              } else {
                  callback(null, key.toString('base64'));
              }
          });
      }

  };
  autoIncrement.initialize(mongoose.connection);
  UserSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'userId', startAt: 1, incrementBy: 1 });
  export default mongoose.model('User', UserSchema);
