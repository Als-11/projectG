 'use strict';

var app = require('../..');
import request from 'supertest';
import {getToken} from '../user/user.integration.js';
import {residentDetails} from '../complaint/complaint.integration.js';
import {onlyToken} from '../complaint/complaint.integration.js';

var newBillservice = [];
var token;
var access_token;

describe('Billservice API:', function() {

  describe('GET  /api/billservices/getservice', function() {
    var billservices;
    beforeEach(function(done) {
        token = onlyToken();
      access_token = "access_token="+token; 
      var reqObj = request(app);
        var req = reqObj.get('/api/billservices/getservice?'+access_token);
         // req.cookies = access_token ;
        req.expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          billservices = res.body; 
          done();
        });
    });

    it('should respond with the category', function() {
      billservices.category == "Electricity";
    });

  });

  describe('POST /api/billservices/userSelectedCategory', function() {
    beforeEach(function( ) {
      var residentToken = residentDetails();
     var req =  request(app).post('/api/billservices/userSelectedCategory?'+access_token);
     req.cookies = residentToken;
        req.send({
          category:'Prepaid'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return  err;
          }
          newBillservice = res.body;
          // done();
        });
    });

    it('should respond with the newly created billservice', function() {
      newBillservice.category == 'Prepaid';
    });

  });

  describe('POST /api/billservices/userSelectedoperator', function() {
    beforeEach(function() {
      var residentToken = residentDetails();
      var req = request(app).post('/api/billservices/userSelectedoperator?'+access_token);
      req.cookies = residentToken;
        req.send({
          category:'Prepaid',
          operator:"Airtel"
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return err;
          }
          newBillservice = res.body; 
          
        });
    });

    it('should respond with the newly created billservice', function() { 
      newBillservice.billServiceId == 1;
    });

  });



});

