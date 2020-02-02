'use strict';

var app = require('../..');
import request from 'supertest';
import {getToken} from '../user/user.integration.js';
import {communityDetails} from '../community/community.integration.js';
import {employeeFinalToken} from '../employee/employee.integration.js';

var token;
var residentToken;
var newComplaint;
var cookies;
var employeesToken;
var employeesUserId;

describe('Complaint API:', function() {

 describe('resident token generation', function() {

    it('resident token generation',function(done){
      request(app)
        .post('/auth/local')
        .send({
          email: 'resident@guwha.com',
          password: 'password'
        })
        .expect(200)
        .end((err, res) => {
        var sid = res.headers['set-cookie'].pop().split(';')[0];
          token = res.body.token;
          residentToken="connect.sid="+sid+";token="+token;
          done();
        });
    });
 });


  describe('POST /api/complaints', function() {
    beforeEach(function(done) {
      var req = request(app) .post('/api/complaints')
      req.cookies = residentToken;
        req.send({
           title:'Complaint1',
           complaintdescription:'description1'                                            
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newComplaint = res.body;
          done();
        });
    });

    it('should respond with the newly created complaint', function() {
      newComplaint.title == 'Complaint1';
      newComplaint.complaintdescription == 'description1';
    });

  });

  describe('GET /api/complaints', function() {
    var complaints;

    beforeEach(function(done) {
      var req=request(app).get('/api/complaints')
      req.cookies = residentToken;
        req.expect(200)
        // .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) { 
            return done(err);
          } 
          complaints = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      // complaints.should.be.instanceOf(Array);
    });

  });

  


  describe('GET /api/complaints/count', function() {
    var complaints;
    beforeEach(function(done) {
      var communityadmintoken = getToken();
      var req = request(app).get('/api/complaints/count')
      req.cookies = communityadmintoken;
        req.expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          complaints = res.body; 
          done();
        });
    });

    it('should respond with JSON array', function() {
      complaints == 1;
    });

  });


  describe('GET /api/complaints/closedComplaints', function() {
    var complaints;
    beforeEach(function(done) {
      var communityadmintoken = getToken();
      var req = request(app).get('/api/complaints/closedComplaints')
      req.cookies = communityadmintoken;
        req.expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          complaints = res.body; 
          done();
        });
    });

    it('should respond with JSON array', function() {
      // complaints == 1;
    });

  });

  describe('GET /api/complaints/complaintsCounts', function() {
    var complaints;
    beforeEach(function(done) {
      var communityadmintoken = getToken();
      var req = request(app).get('/api/complaints/complaintsCounts')
      req.cookies = communityadmintoken;
        req.expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          complaints = res.body; 
          done();
        });
    });

    it('should respond with JSON array', function() {
      // complaints == 1;
    });

  });

  describe('GET /api/complaints/complaintCount', function() {
    var complaints;
    beforeEach(function(done) {
      var communityadmintoken = getToken();
      var req = request(app).get('/api/complaints/complaintCount')
      req.cookies = communityadmintoken;
        req.expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          complaints = res.body; 
          done();
        });
    });

    it('should respond with JSON array', function() {
      // complaints == 1;
    });

  });

  describe('GET /api/complaints/respectivePerson', function() {
    var complaints;
    beforeEach(function(done) {
      var communityadmintoken = getToken();
      var req = request(app).get('/api/complaints/respectivePerson')
      req.cookies = communityadmintoken;
        req.expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          complaints = res.body; 
          done();
        });
    });

    it('should respond with JSON array', function() {
      // complaints == 1;
    });

  });


  describe('POST /api/complaints/listComplaints', function() {
    var listOfComplints;

    beforeEach(function(done) {
      var communityadmintoken = getToken();
      var req = request(app).post('/api/complaints/listComplaints')
      req.cookies = communityadmintoken; 
        req.expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          listOfComplints = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      listOfComplints.should.be.instanceOf(Array);
    });

  });

  

  


describe('GET /api/complaints/getassignedPersons', function() {
    var  employeeDetails = [];
    beforeEach(function( ) {
      var communityadmintoken = getToken();
      var req = request(app).get('/api/complaints/getassignedPersons')
      req.cookies = communityadmintoken;
        req.expect(200)
        req.end((err, res) => {
          if (err) { 
            return  err;
          } 
           employeesUserId = res.body.userId;  
          // done();
        });
    });

    it('should respond with the requested complaint', function() {
      // complaint.userId == 10;
      // complaint.firstName == "sai";
      // complaint.lastName == "ram";
    });

  });


describe('POST /api/complaints/assignCompliant', function() {
    var complaints;
    beforeEach (function(){
    var communityadmintoken = getToken();
         var req = request(app).post('/api/complaints/assignCompliant')
         req.cookies = communityadmintoken; 
         req.send({
          assigned : "sai",
          description:"hello commedsnt",
          complaintId:newComplaint.complaintId,
          assingedId:employeesUserId,
          category: "als"
        })
        req.expect(200)
        .end((err, res) => {
          if (err) { 
            return  err;
          }
          complaints = res.body; 
          // done();
        });

});
    it('complaint assignes to a person' ,function()
    {
         
    });
});
  describe('GET /api/complaints/count', function() {
    var complaints;
    beforeEach(function() {
      var communityadmintoken = getToken();
      var req = request(app).get('/api/complaints/count')
      req.cookies = communityadmintoken;
        req.expect(200)
        .end((err, res) => {
          if (err) {
            return err;
          }
          complaints = res.body; 
        });
    });

    it('should respond with JSON array', function() {
      complaints == 0;
    });

  });

});

export function residentDetails(){
  return residentToken;
}
export function onlyToken(){
  return token;
}
export function complaintDetails(){
  return newComplaint;
}