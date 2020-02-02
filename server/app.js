/**
 * Main application file
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import config from './config/environment';
import http from 'http';
import Paymentsrequests from './api/paymentsrequests/paymentsrequests.model';
import Community from './api/community/community.model';
import User from './api/user/user.model';

// Connect to MongoDB
export default function (app) {
  var env = app.get('env');
  app.set('appPath', path.join(config.root, 'client'));

  if ('development' === env) {
    app.use(require('connect-livereload')());
    var cors = require('cors')
    //app.user(bodyParser.json());
    // after the code that uses bodyParser and other cool stuff
    app.use(cors(corsOptions));
  }
}
mongoose.connect(config.mongo.uri, config.mongo.options);
var c = mongoose.connection.on('error', function (err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(c);

// Populate databases with sample data
if (config.seedDB) {
  require('./config/seed');
}

// Setup server


var cors = require('cors')
//app.user(bodyParser.json());
// after the code that uses bodyParser and other cool stuff
var app = express();
var originsWhitelist = [
  'http://localhost:8100'
];
var corsOptions = {
  origin: function (origin, callback) {
    var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
    callback(null, isWhitelisted);
  },
  credentials: true
}
app.use(cors(corsOptions));

var server = http.createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});
require('./config/socketio').default(socketio);
require('./config/express').default(app);
require('./routes').default(app);
// Start server
function startServer() {
  require('./cron').cron();
  var helmet = require('helmet')
  app.use(helmet());
  app.disable('x-powered-by'); //restict the server name in the browser
  // var validator  = require('express-validator');
  // var bodyParser = require('body-parser');
  // app.use(bodyParser.urlencoded());
  // app.use(validator());
  // app.use(function(req, res, next) {
  //   console.log("hgfvkdjfgjksdgjkhsdjkfgjkfjgh");
  //   console.log(req);
  //   for (var item in req.body) {
  //     req.sanitize(item).escape();
  //   }
  //   next();
  // });
  var csp = require('helmet-csp')
  app.use(csp({ //restict the  script and frame injection
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ['*.google-analytics.com'],
      styleSrc: ["'unsafe-inline'"],
      imgSrc: ['*.google-analytics.com'],
      connectSrc: ["'none'"],
      fontSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'none'"],
      frameSrc: ["'none'"]
    },
    loose: false,
    reportOnly: false,
    setAllHeaders: false,
    browserSniff: true
  }));
  var ienoopen = require('ienoopen') //restrict to open in internet explorer
  app.use(ienoopen());

  // CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
  app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });
  app.angularFullstack = server.listen(config.port, config.ip, function () {});
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;
