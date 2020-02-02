'use strict';

var app = require('../..');
import request from 'supertest';

var newHistory;

describe('History API:', function() {

  // describe('GET /api/historys', function() {
  //   var historys;

  //   beforeEach(function(done) {
  //     request(app)
  //       .get('/api/historys')
  //       .expect(200)
  //       .expect('Content-Type', /json/)
  //       .end((err, res) => {
  //         if (err) {
  //           return done(err);
  //         }
  //         historys = res.body;
  //         done();
  //       });
  //   });

  //   it('should respond with JSON array', function() {
  //     historys.should.be.instanceOf(Array);
  //   });

  // });

  describe('POST /api/historys/getComplaintHistory', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/historys/getComplaintHistory')
        .send({
          complaintId: 1012,
          // info: 'This is the brand new history!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newHistory = res.body;
          done();
        });
    });

    it('should respond with the newly created history', function() {
      newHistory.complaintId == 1012
      // newHistory.info.should.equal('This is the brand new history!!!');
    });

  });

  // describe('GET /api/historys/:id', function() {
  //   var history;

  //   beforeEach(function(done) {
  //     request(app)
  //       .get('/api/historys/' + newHistory._id)
  //       .expect(200)
  //       .expect('Content-Type', /json/)
  //       .end((err, res) => {
  //         if (err) {
  //           return done(err);
  //         }
  //         history = res.body;
  //         done();
  //       });
  //   });

  //   afterEach(function() {
  //     history = {};
  //   });

  //   it('should respond with the requested history', function() {
  //     history.name.should.equal('New History');
  //     history.info.should.equal('This is the brand new history!!!');
  //   });

  // });

  // describe('PUT /api/historys/:id', function() {
  //   var updatedHistory;

  //   beforeEach(function(done) {
  //     request(app)
  //       .put('/api/historys/' + newHistory._id)
  //       .send({
  //         name: 'Updated History',
  //         info: 'This is the updated history!!!'
  //       })
  //       .expect(200)
  //       .expect('Content-Type', /json/)
  //       .end(function(err, res) {
  //         if (err) {
  //           return done(err);
  //         }
  //         updatedHistory = res.body;
  //         done();
  //       });
  //   });

  //   afterEach(function() {
  //     updatedHistory = {};
  //   });

  //   it('should respond with the updated history', function() {
  //     updatedHistory.name.should.equal('Updated History');
  //     updatedHistory.info.should.equal('This is the updated history!!!');
  //   });

  // });

  // describe('DELETE /api/historys/:id', function() {

  //   it('should respond with 204 on successful removal', function(done) {
  //     request(app)
  //       .delete('/api/historys/' + newHistory._id)
  //       .expect(204)
  //       .end((err, res) => {
  //         if (err) {
  //           return done(err);
  //         }
  //         done();
  //       });
  //   });

  //   it('should respond with 404 when history does not exist', function(done) {
  //     request(app)
  //       .delete('/api/historys/' + newHistory._id)
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
