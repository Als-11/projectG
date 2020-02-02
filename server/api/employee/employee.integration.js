 'use strict';

var app = require('../..');
import request from 'supertest';
import {getToken} from '../user/user.integration.js' ;

var newEmployee;
var communityAdminToken;
var cookies;
var employeeToken;
var token;



describe('Employee API:', function() {

  describe('POST /api/employees', function() { 
    beforeEach(function(done) {
      communityAdminToken = getToken();
      var req = request(app) .post('/api/employees')
      req.cookies = communityAdminToken; 
        req.send({
          emailId: 'employee@gmail.com',
          firstName: 'security',
          lastName :'security',
          phoneNumber:'1234567890',
        })
        req.expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newEmployee = res.body;
          done();
        });
    });

    it('should respond with the newly created employee', function() {
      newEmployee.firstName.should.equal('security');
      newEmployee.phoneNumber.should.equal('1234567890');
    });

  });


  describe('emplotee token ',function()
  {
    it('token generation',function(done){

      request(app)
        .post('/auth/local')
        .send({
          email: 'employee@gmail.com',
          password: 'security_security'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
        var sid = res.headers['set-cookie'].pop().split(';')[0];
          token  = res.body.token;
           employeeToken="connect.sid="+sid+";token="+token;            
          done();
        });
      });
  });

 describe('GET /api/employees', function() {
    var employees;
    
    beforeEach(function(done) {
      communityAdminToken = getToken();
      var req = request(app) .get('/api/employees')
        req.cookies = communityAdminToken;
        req.expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          employees = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      employees.should.be.instanceOf(Array);
    });

  });


  describe('GET /api/employees/:id', function() {
    var employee;
   
    beforeEach(function(done) {
        communityAdminToken = getToken();
      var req = request(app).get('/api/employees/')
      req.cookies = communityAdminToken;
        req.expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          employee = res.body;
          done();
        });
    });

    // afterEach(function() {
    //   employee = {};
    // });

    it('should respond with the requested employee', function() {
      employee.firstName=='security';
      employee.lastName=='security';
    });

  });

  // describe('PUT /api/employees/:id', function() {
  //   var updatedEmployee;

  //   beforeEach(function(done) {
  //     request(app)
  //       .put('/api/employees/' + newEmployee._id)
  //       .send({
  //         name: 'Updated Employee',
  //         info: 'This is the updated employee!!!'
  //       })
  //       .expect(200)
  //       .expect('Content-Type', /json/)
  //       .end(function(err, res) {
  //         if (err) {
  //           return done(err);
  //         }
  //         updatedEmployee = res.body;
  //         done();
  //       });
  //   });

  //   afterEach(function() {
  //     updatedEmployee = {};
  //   });

  //   it('should respond with the updated employee', function() {
  //     updatedEmployee.name.should.equal('Updated Employee');
  //     updatedEmployee.info.should.equal('This is the updated employee!!!');
  //   });

  // });

  // describe('POST/api/employees/deleteEmployee', function() {

  //   it('should respond with 204 on successful removal', function(done) {
  //     request(app)
  //       .post('/api/employees/deleteEmployee')
  //       .send({
  //         userId : newEmployee.userId
  //       })
  //       .expect(204)
  //       .end((err, res) => {
  //         if (err) {
  //           return done(err);
  //         }
  //         done();
  //       });
  //   });

  //   it('should respond with 404 when employee does not exist', function(done) {
  //     request(app)
  //       .delete('/api/employees/deleteEmployee')
  //       .expect(404)
  //       .end((err, res) => {
  //         if (err) {
  //           return done(err);
  //         }
  //         done();
  //       });
  //   });

  // });

});
export function employeeFinalToken() {
  return employeeToken;
}