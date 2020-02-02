'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  mongo: {
    //uri: 'mongodb://localhost/guwha-dev'
    uri: 'mongodb://127.0.0.1:27017/guwha-dev'
  },

  // Seed database on startup
  seedDB: true

};
