'use strict';

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    //uri: 'mongodb://localhost/guwha-test'
    uri: 'mongodb://admin:admin@ds019786.mlab.com:19786/guwha-test-db'
  },
  sequelize: {
    uri: 'sqlite://',
    options: {
      logging: false,
      storage: 'test.sqlite',
      define: {
        timestamps: false
      }
    }
  }
};
