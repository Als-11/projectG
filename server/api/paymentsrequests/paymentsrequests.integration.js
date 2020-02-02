'use strict';

var app = require('../..');
import request from 'supertest';

var newPaymentsrequests;

describe('Paymentsrequests API:', function() {
  describe('GET /api/paymentsrequets', function() {
    var paymentsrequestss;

    beforeEach(function(done) {
      request(app)
        .get('/api/paymentsrequets')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          paymentsrequestss = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      paymentsrequestss.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/paymentsrequets', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/paymentsrequets')
        .send({
          name: 'New Paymentsrequests',
          info: 'This is the brand new paymentsrequests!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newPaymentsrequests = res.body;
          done();
        });
    });

    it('should respond with the newly created paymentsrequests', function() {
      newPaymentsrequests.name.should.equal('New Paymentsrequests');
      newPaymentsrequests.info.should.equal('This is the brand new paymentsrequests!!!');
    });
  });

  describe('GET /api/paymentsrequets/:id', function() {
    var paymentsrequests;

    beforeEach(function(done) {
      request(app)
        .get(`/api/paymentsrequets/${newPaymentsrequests._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          paymentsrequests = res.body;
          done();
        });
    });

    afterEach(function() {
      paymentsrequests = {};
    });

    it('should respond with the requested paymentsrequests', function() {
      paymentsrequests.name.should.equal('New Paymentsrequests');
      paymentsrequests.info.should.equal('This is the brand new paymentsrequests!!!');
    });
  });

  describe('PUT /api/paymentsrequets/:id', function() {
    var updatedPaymentsrequests;

    beforeEach(function(done) {
      request(app)
        .put(`/api/paymentsrequets/${newPaymentsrequests._id}`)
        .send({
          name: 'Updated Paymentsrequests',
          info: 'This is the updated paymentsrequests!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedPaymentsrequests = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPaymentsrequests = {};
    });

    it('should respond with the original paymentsrequests', function() {
      updatedPaymentsrequests.name.should.equal('New Paymentsrequests');
      updatedPaymentsrequests.info.should.equal('This is the brand new paymentsrequests!!!');
    });

    it('should respond with the updated paymentsrequests on a subsequent GET', function(done) {
      request(app)
        .get(`/api/paymentsrequets/${newPaymentsrequests._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let paymentsrequests = res.body;

          paymentsrequests.name.should.equal('Updated Paymentsrequests');
          paymentsrequests.info.should.equal('This is the updated paymentsrequests!!!');

          done();
        });
    });
  });

  describe('PATCH /api/paymentsrequets/:id', function() {
    var patchedPaymentsrequests;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/paymentsrequets/${newPaymentsrequests._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Paymentsrequests' },
          { op: 'replace', path: '/info', value: 'This is the patched paymentsrequests!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedPaymentsrequests = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedPaymentsrequests = {};
    });

    it('should respond with the patched paymentsrequests', function() {
      patchedPaymentsrequests.name.should.equal('Patched Paymentsrequests');
      patchedPaymentsrequests.info.should.equal('This is the patched paymentsrequests!!!');
    });
  });

  describe('DELETE /api/paymentsrequets/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/paymentsrequets/${newPaymentsrequests._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when paymentsrequests does not exist', function(done) {
      request(app)
        .delete(`/api/paymentsrequets/${newPaymentsrequests._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
