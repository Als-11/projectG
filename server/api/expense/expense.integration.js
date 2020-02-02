'use strict';

var app = require('../..');
import request from 'supertest';
import {communityDetails} from '../community/community.integration.js';
import {residentDetails} from '../complaint/complaint.integration.js';
import {getToken} from '../user/user.integration.js';

var newExpense;
var residentToken; 
var newCommunity = communityDetails();
describe('Expense API:', function() {

  // describe('GET /api/expenses', function() {
  //   var expenses;

  //   beforeEach(function(done) {
  //     request(app)
  //       .get('/api/expenses')
  //       .expect(200)
  //       .expect('Content-Type', /json/)
  //       .end((err, res) => {
  //         if (err) {
  //           return done(err);
  //         }
  //         expenses = res.body;
  //         done();
  //       });
  //   });

  //   it('should respond with JSON array', function() {
  //     expenses.should.be.instanceOf(Array);
  //   });

  // });

  describe('POST /api/expenses/expensetypeInfo', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/expenses/expensetypeInfo')
        .send({
          category: 'Transportation',
          // info: 'This is the brand new expense!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newExpense = res.body;
          done();
        });
    });

    it('should respond with the newly created expense', function() {
      // newExpense.category.should.equal('Transportation');
      // newExpense.info.should.equal('This is the brand new expense!!!');
    });
  });

  
  describe('POST /api/expenses/expenseSaved', function() {
    beforeEach(function(done) {
        var communityAdmin = getToken();      
        var req=request(app).post('/api/expenses/expenseSaved')
        req.cookies = communityAdmin;
        req.send({
                              expenseName:'Transportation',
                              expenseAmount:1000,
                              // communityId:communityId,
                              expenseTypeId:1000,
                              expenseDate:new Date("2016-12-14T00:00:00.000+05:30"),
                              recurring:true,
                              recurringPeriod:'Monthly',
                             recurringDate:new Date("2017-2-14T00:00:00.000+05:30"),
                             status:'Paid',
                             comments:'Very Good'
          // info: 'This is the brand new expense!!!'
        })
        req.expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newExpense = res.body;
          done();
        });
    });

    it('should respond with the newly created expense', function() {
      newExpense.comments.should.equal('Very Good');
      // newExpense.info.should.equal('This is the brand new expense!!!');
    });

  });


describe('POST /api/expenses/expensesDetailsMonthly', function() {
    beforeEach(function(done) {
      var residentToken=residentDetails();
      var req=request(app).post('/api/expenses/expensesDetailsMonthly')
      req.cookies = residentToken;
        req.send({
          fromDate:new Date("2016-09-14T00:00:00.000+05:30"),
           toDate : new Date("2016-12-14T00:00:00.000+05:30")                   
          // info: 'This is the brand new expense!!!'
        })
        req.expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newExpense = res.body;
          done();
        });
    });

    it('should respond with the newly created expense', function() {
      // newExpense.comments.should.equal('Very Good');
      // newExpense.info.should.equal('This is the brand new expense!!!');
    });

  });

describe('POST /api/expenses/communityExpenses', function() {
    beforeEach(function(done) {
      var newCommunity = getToken();
      var req = request(app).post('/api/expenses/communityExpenses')
      req.cookies = newCommunity;
        req.send({
          fromDate:new Date("2016-06-14T00:00:00.000+05:30"),
          toDate : new Date("2016-12-14T00:00:00.000+05:30")
                              
          // info: 'This is the brand new expense!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newExpense = res.body;
          done();
        });
    });

    it('should respond with the newly created expense', function() {
      // newExpense.comments.should.equal('Very Good');
      // newExpense.info.should.equal('This is the brand new expense!!!');
    });

  }); 


describe('GET /api/expenses/gettingexpensesInfo', function() {
    beforeEach(function(done) {
      var newCommunity = getToken();
      var req=request(app).get('/api/expenses/gettingexpensesInfo')
        req.cookies = newCommunity;
        req.expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newExpense = res.body;
          done();
        });
    });

    it('should respond with the newly created expense', function() {
      // newExpense.comments.should.equal('Very Good');
      // newExpense.info.should.equal('This is the brand new expense!!!');
    });

  });
  // describe('GET /api/expenses/:id', function() {
  //   var expense;

  //   beforeEach(function(done) {
  //     request(app)
  //       .get('/api/expenses/' + newExpense._id)
  //       .expect(200)
  //       .expect('Content-Type', /json/)
  //       .end((err, res) => {
  //         if (err) {
  //           return done(err);
  //         }
  //         expense = res.body;
  //         done();
  //       });
  //   });

  //   afterEach(function() {
  //     expense = {};
  //   });

  //   it('should respond with the requested expense', function() {
  //     expense.name.should.equal('New Expense');
  //     expense.info.should.equal('This is the brand new expense!!!');
  //   });

  // });

  // // describe('PUT /api/expenses/:id', function() {
  // //   var updatedExpense;

  // //   beforeEach(function(done) {
  // //     request(app)
  // //       .put('/api/expenses/' + newExpense._id)
  // //       .send({
  // //         name: 'Updated Expense',
  // //         info: 'This is the updated expense!!!'
  // //       })
  // //       .expect(200)
  // //       .expect('Content-Type', /json/)
  // //       .end(function(err, res) {
  // //         if (err) {
  // //           return done(err);
  // //         }
  // //         updatedExpense = res.body;
  // //         done();
  // //       });
  // //   });

  // //   afterEach(function() {
  // //     updatedExpense = {};
  // //   });

  // //   it('should respond with the updated expense', function() {
  // //     updatedExpense.name.should.equal('Updated Expense');
  // //     updatedExpense.info.should.equal('This is the updated expense!!!');
  // //   });

  // // });

  // describe('DELETE /api/expenses/:id', function() {

  //   it('should respond with 204 on successful removal', function(done) {
  //     request(app)
  //       .delete('/api/expenses/' + newExpense._id)
  //       .expect(204)
  //       .end((err, res) => {
  //         if (err) {
  //           return done(err);
  //         }
  //         done();
  //       });
  //   });

  //   it('should respond with 404 when expense does not exist', function(done) {
  //     request(app)
  //       .delete('/api/expenses/' + newExpense._id)
  //       .expect(404)
  //       .end((err, res) => {
  //         if (err) {
  //           return done(err);
  //         }
  //         done();
  //       });
  //   });

  });

