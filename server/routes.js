/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/api/floors', require('./api/floors'));
  app.use('/api/notificationss', require('./api/notifications'));
  app.use('/api/historys', require('./api/history'));
  app.use('/api/serviceProviderDetails', require('./api/serviceProviderDetail'));
  app.use('/api/expenses', require('./api/expense'));
  app.use('/api/communitymembersmappings', require('./api/communitymembersmapping'));
  app.use('/api/serviceRequests', require('./api/serviceRequest'));
  app.use('/api/userServProvRegists', require('./api/userServProvRegist'));
  app.use('/api/servProvRegists', require('./api/servProvRegist'));
  app.use('/api/typesForServices', require('./api/typesForService'));
  app.use('/api/paymentsrequests',require('./api/paymentsrequests'));
 // app.use('/api/onlineMessages', require('./api/onlineMessage'));
  app.use('/api/userbillservices', require('./api/userbillservice'));
  app.use('/api/amenitiesBookings', require('./api/amenitiesBooking'));
  app.use('/api/visitors', require('./api/visitor'));
  app.use('/api/comments', require('./api/comment'));
  // app.use('/api/threads', require('./api/thread'));
  // app.use('/api/topics', require('./api/topic'));
  app.use('/api/complaints', require('./api/complaint'));
  app.use('/api/employees', require('./api/employee'));
  app.use('/api/approvals', require('./api/approval'));
  app.use('/api/amenities', require('./api/amenity'));
  app.use('/api/community', require('./api/community'));
  app.use('/api/apartments', require('./api/apartment'));
  app.use('/api/customers', require('./api/customer'));
  app.use('/api/appointments', require('./api/appointment'));
  app.use('/api/parties', require('./api/party'));
  app.use('/api/services', require('./api/service'));
  app.use('/api/slots', require('./api/slot'));
  app.use('/api/billservices', require('./api/billservice'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth').default);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
}
