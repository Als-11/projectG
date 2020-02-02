'use strict';

var app = require('../..');
import request from 'supertest';
import {getToken} from '../user/user.integration.js';
import {communityDetails} from '../community/community.integration.js';
import {employeeFinalToken} from '../employee/employee.integration.js';
import Visitor from './visitor.model';
import Complaint from '../complaint/complaint.model';
import Approval from '../approval/approval.model';
import User from '../user/user.model';
import Community from '../community/community.model';
import Employee from '../employee/employee.model';
import Communitymembersmapping from '../communitymembersmapping/communitymembersmapping.model';

var newVisitor;
var outTime;
var cookies;

describe('visitors api',function(){

   after(function(){
    return Visitor.remove();
  });


  after(function(){
    return Complaint.remove();
  });

  after(function(){
    return Approval.remove();
  })
  
  after(function(){
    return Employee.remove();
  })
  
  after(function(){
    return User.remove();
  })
  
  after(function(){
    return Community.remove();
  }) 

  after(function(){
    return Communitymembersmapping.remove();
  }) 


describe('POST /api/visitors/create', function() {
  
    beforeEach(function(done) {
      var communityInfo = communityDetails();
var employeeToken = employeeFinalToken();
      var req = request(app).post('/api/visitors/create')
      req.cookies = employeeToken;
      req.send({
          name: "zuber",
                phoneNumber: "7207777386",
                blockName: "blockb",    
                flatNo: "202",   
                purpose: "meeting",
                vehicleNo: "Ap25464",
                userId:communityInfo.userId
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newVisitor = res.body; 
          done();
        });
    });

    it('should respond with the newly created visitor', function() {
      newVisitor.name == "zuber";
      newVisitor.vehicleNo == "Ap25464";
      newVisitor.flatNo == "202";
    });

  });



describe('Visitor API:', function() {

  describe('GET /api/visitors', function() {
    var visitors = [];
    beforeEach(function(done) {
      var employeeToken = employeeFinalToken(); 
     var req =  request(app).get('/api/visitors/')
     req.cookies = employeeToken;
         req.expect(200)
        // .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {  
            return done(err);
          } 
          visitors = res.body; 
          done();
        });
    });

    it('should respond with JSON array', function() {
      // visitors.outTime == null;
    });

  });


  describe('GET /api/visitors/getHighestVisitors', function() {
    var visitors;
    beforeEach(function(done) {
      var employeeToken = employeeFinalToken(); 
     var req =  request(app).get('/api/visitors/getHighestVisitors')
     req.cookies = employeeToken;
         req.expect(200)
        // .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          visitors = res.body; 
          done();
        });
    });

    it('should respond with JSON array', function() {
      // visitors.outTime == null;
    });

  });


//   describe('post /api/visitors/visitors', function() {
//     var visitors;
//      it('get the visitors thoose who have outtime', function(done) {
//        var employeeToken = employeeFinalToken();
//       var req=request(app).post('/api/visitors/visitors')
//       req.cookies = employeeToken;
//         .expect(200)
//         .expect('Content-Type', /json/)
//         .end((err, res) => {
//           if (err) {
//             return done(err);
//           }
//           visitors = res.body;
//           done();
//         });
//     });
// });

  // describe('POST /api/visitors/getVisitors', function() {     //communityAdmin (dashboard)
  //   var visitors;
  //   it('should respond with the newly created visitor', function() {
  //     var communityAdmin = getToken();
  //     var req = request(app).post('/api/visitors/getVisitors')
  //     req.cookies = communityAdmin;
  //     // req.send{(
  //     //  )}
  //       .expect(200)
  //       .expect('Content-Type', /json/)
  //       .end((err, res) => {  
  //         if (err) {
  //           return done(err);
  //         }
  //         visitors = res.body; 
  //         done();
  //       });
  //          // visitors.name == 'zuber';
  //   });

  // });

  describe('POST /api/visitors/getSkippedVisitors', function() {     //communityAdmin (dashboard)
    var visitors;
    beforeEach(function(done) {
     var communityAdmin = getToken();
      var req = request(app).post('/api/visitors/getSkippedVisitors')
      req.cookies = communityAdmin;
      req.send ({
        count:10
       })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {  
          if (err) {
            return done(err);
          }
          visitors = res.body; 
          done();
        });
    });

    it('should respond with the newly created visitor', function() {
           // visitors.name == 'zuber';
    });

  });

  describe('POST /api/visitors/userSkippedVisitors', function() {     //communityAdmin (dashboard)
    var visitors;
    beforeEach(function(done) {
     var communityAdmin = getToken();
      var req = request(app).post('/api/visitors/userSkippedVisitors')
      req.cookies = communityAdmin;
      req.send({
        count:10
       })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {  
          if (err) {
            return done(err);
          }
          visitors = res.body; 
          done();
        });
    });

    it('should respond with the newly created visitor', function() {
           // visitors.name == 'zuber';
    });

  });


  describe('POST /api/visitors/updatetime', function() {
    var visitors;
    beforeEach(function(done) {
      request(app)
        .post('/api/visitors/updatetime')
        .send({
          visitorId: newVisitor.visitorId
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {  
          if (err) {
            return done(err);
          }
          visitors = res.body; 
          done();
        });
    });

    it('should respond with the newly created visitor', function() {
      visitors.visitorId == newVisitor.visitorId;
    });

  });

  describe('POST /api/visitors/visitors', function() {
    var visitors;
    beforeEach(function(done) {
      var als = getToken();
     var req = request(app).post('/api/visitors/visitors')
     req.cookies = als;
        req.send({
          visitorId: newVisitor.visitorId
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {  
          if (err) {
            return done(err);
          }
          visitors = res.body; 
          done();
        });
    });

    it('should respond with the newly created visitor', function() {
      // visitors.visitorId == newVisitor.visitorId;
    });

  });



  // describe('POST /api/visitors/userVisitors', function() {
  //   var visitors;
  //   beforeEach(function(done) {
  //     var employeeToken = employeeFinalToken();
  //     var req = request(app).post('/api/visitors/userVisitors')
  //     req.cookies = employeeToken;
  //       req.expect(200)
  //       .expect('Content-Type', /json/)
  //       .end((err, res) => {  
  //         if (err) {
  //           return done(err);
  //         }
  //         visitors = res.body; 
  //         done();
  //       });
  //   });

  //   it('should respond with the newly created visitor', function() {

  //   });

  // });


// describe('POST /api/visitors/visitorsCount', function() {
//     var visitors;
//     beforeEach(function(done) {
//       var employeeToken = employeeFinalToken();
//       var req = request(app).post('/api/visitors/visitorsCount')
//       req.cookies = employeeToken;
//         req.expect(200)
//         .expect('Content-Type', /json/)
//         .end((err, res) => {  
//           if (err) {
//             return done(err);
//           }
//           visitors = res.body; 
//           done();
//         });
//     });

//     it('should respond with the newly created visitor', function() {

//     });

  // });
  describe('POST /api/visitors/deleteVisitor', function() {

    it('should respond with 204 on successful removal', function(done) {
      var communityAdminToken = getToken();
      var req = request(app).post('/api/visitors/deleteVisitor')
      req.cookies = communityAdminToken;
        req.send({
          visitorId: newVisitor.visitorId
        })
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
})
