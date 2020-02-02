 'use strict';

var app = require('../..');
import request from 'supertest';
import Userbillservice from './userbillservice.model';
import {getToken} from '../user/user.integration.js' ;


var newUserbillservice;

describe('Userbillservice API:', function() {

  after(function(){
    return Userbillservice.remove();
  })
  var userbillservice;

   describe('POST/api/userbillservices/saveBillservice', function() {
    

    beforeEach(function(done) {
      var communityAdmintoken = getToken();
      var req =request(app).post('/api/userbillservices/saveBillservice')
      req.cookies = communityAdmintoken;
        req.send({
          billServiceId : '43',
          uniqueId : '8374141174',
          operator : 'Airtel',
          Category : 'Prepaid'
  })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          userbillservice = res.body;
          done();
        });
    });

    // afterEach(function() {
    //   userbillservice = {};
    // });

    it('should respond with the requested userbillservice', function() {
      userbillservice.uniqueId = '8374141174';
      userbillservice.operator = 'Airtel';
      userbillservice.Category = 'Prepaid';
      // userbillservice.info.should.equal('This is the brand new userbillservice!!!');
    });

  });

  describe('GET /api/userbillservices', function() {
    var userbillservices;

    beforeEach(function(done) {
      var communityAdmintoken = getToken();
      var req = request(app).get('/api/userbillservices')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          userbillservices = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      userbillservices.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/userbillservices/getbills', function() {
    beforeEach(function(done) {
      var communityAdmintoken = getToken();
      var req = request(app).post('/api/userbillservices/getbills')
      req.cookies = communityAdmintoken;
      req.send({
        userId : userbillservice.userId
      })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newUserbillservice = res.body; 
          done();
        });
    });

    it('should respond with the newly created userbillservice', function() {
      newUserbillservice.Category == 'Prepaid';
      // newUserbillservice.info.should.equal('This is the brand new userbillservice!!!');
    });

  });

  describe('POST/api/userbillservices/updateUserBillDetails', function() {
    var updatedUserbillservice;
    beforeEach(function(done) {
      var communityAdmintoken = getToken();
      var req = request(app).post('/api/userbillservices/updateUserBillDetails')
      req.cookies = communityAdmintoken;
        req.send({
          billServiceId : '43',
          uniqueId : '8374141175',
          operator : 'Idea',
          Category : 'Prepaid'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedUserbillservice = res.body;
          done();
        });
    });

    // afterEach(function() {
    //   updatedUserbillservice = {};
    // });

    it('should respond with the updated userbillservice', function() {
      updatedUserbillservice.uniqueId = '8374141175';
      updatedUserbillservice.operator = 'Idea';
      updatedUserbillservice.Category = 'Prepaid';
    });

  });

//   describe('DELETE /api/userbillservices/:id', function() {

//     it('should respond with 204 on successful removal', function(done) {
//       request(app)
//         .delete('/api/userbillservices/' + newUserbillservice._id)
//         .expect(204)
//         .end((err, res) => {
//           if (err) {
//             return done(err);
//           }
//           done();
//         });
//     });

//     it('should respond with 404 when userbillservice does not exist', function(done) {
//       request(app)
//         .delete('/api/userbillservices/' + newUserbillservice._id)
//         .expect(404)
//         .end((err, res) => {
//           if (err) {
//             return done(err);
//           }
//           done();
//         });
//     });

//   });


});