/**
 * Socket.io configuration
 */
'use strict';

import config from './environment';

// When the user disconnects.. perform this
function onDisconnect(socket) {
}

// When the user connects.. perform this
function onConnect(socket) {
  // When the client emits 'info', this listens and executes
  socket.on('info', data => {
    socket.log(JSON.stringify(data, null, 2));
  });

  // Insert sockets below
  require('../api/floors/floors.socket').register(socket);
  require('../api/notifications/notifications.socket').register(socket);
  require('../api/history/history.socket').register(socket);
  require('../api/serviceProviderDetail/serviceProviderDetail.socket').register(socket);
  require('../api/expense/expense.socket').register(socket);
  require('../api/communitymembersmapping/communitymembersmapping.socket').register(socket);
  require('../api/serviceRequest/serviceRequest.socket').register(socket);
  require('../api/userServProvRegist/userServProvRegist.socket').register(socket);
  require('../api/servProvRegist/servProvRegist.socket').register(socket);
  require('../api/typesForService/typesForService.socket').register(socket);
  //require('../api/onlineMessage/onlineMessage.socket').register(socket);
  require('../api/userbillservice/userbillservice.socket').register(socket);
  require('../api/amenitiesBooking/amenitiesBooking.socket').register(socket);
  require('../api/visitor/visitor.socket').register(socket);
  require('../api/comment/comment.socket').register(socket);
  require('../api/thread/thread.socket').register(socket);
  require('../api/topic/topic.socket').register(socket);
  require('../api/complaint/complaint.socket').register(socket);
  require('../api/employee/employee.socket').register(socket);
  require('../api/approval/approval.socket').register(socket);
  require('../api/amenity/amenity.socket').register(socket);
  require('../api/community/community.socket').register(socket);
  require('../api/apartment/apartment.socket').register(socket);
  require('../api/customer/customer.socket').register(socket);
  require('../api/appointment/appointment.socket').register(socket);
  require('../api/party/party.socket').register(socket);
  require('../api/service/service.socket').register(socket);
  require('../api/slot/slot.socket').register(socket);
  require('../api/billservice/billservice.socket').register(socket);

}

export default function(socketio) {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  // socketio.use(require('socketio-jwt').authorize({
  //   secret: config.secrets.session,
  //   handshake: true
  // }));

  socketio.on('connection', function(socket) {
    socket.address = socket.request.connection.remoteAddress +
      ':' + socket.request.connection.remotePort;
      
    socket.setMaxListeners(1000);
    socket.connectedAt = new Date();

    socket.log = function(...data) { 
    };

    // Call onDisconnect.
    socket.on('disconnect', () => {
      onDisconnect(socket);
      socket.log('DISCONNECTED');
    });

    // Call onConnect.
    onConnect(socket);
    socket.log('CONNECTED');
  });
}
