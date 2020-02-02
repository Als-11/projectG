'use strict';

var app = require('../..');
import request from 'supertest';

var newServiceRequest;

describe('ServiceRequest API:', function() {
  describe('GET /api/serviceRequests', function() {
    var serviceRequests;

    beforeEach(function(done) {
      request(app)
        .get('/api/serviceRequests')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          serviceRequests = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      serviceRequests.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/serviceRequests', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/serviceRequests')
        .send({
          name: 'New ServiceRequest',
          info: 'This is the brand new serviceRequest!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newServiceRequest = res.body;
          done();
        });
    });

    it('should respond with the newly created serviceRequest', function() {
      newServiceRequest.name.should.equal('New ServiceRequest');
      newServiceRequest.info.should.equal('This is the brand new serviceRequest!!!');
    });
  });

  describe('GET /api/serviceRequests/:id', function() {
    var serviceRequest;

    beforeEach(function(done) {
      request(app)
        .get(`/api/serviceRequests/${newServiceRequest._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          serviceRequest = res.body;
          done();
        });
    });

    afterEach(function() {
      serviceRequest = {};
    });

    it('should respond with the requested serviceRequest', function() {
      serviceRequest.name.should.equal('New ServiceRequest');
      serviceRequest.info.should.equal('This is the brand new serviceRequest!!!');
    });
  });

  describe('PUT /api/serviceRequests/:id', function() {
    var updatedServiceRequest;

    beforeEach(function(done) {
      request(app)
        .put(`/api/serviceRequests/${newServiceRequest._id}`)
        .send({
          name: 'Updated ServiceRequest',
          info: 'This is the updated serviceRequest!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedServiceRequest = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedServiceRequest = {};
    });

    it('should respond with the original serviceRequest', function() {
      updatedServiceRequest.name.should.equal('New ServiceRequest');
      updatedServiceRequest.info.should.equal('This is the brand new serviceRequest!!!');
    });

    it('should respond with the updated serviceRequest on a subsequent GET', function(done) {
      request(app)
        .get(`/api/serviceRequests/${newServiceRequest._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let serviceRequest = res.body;

          serviceRequest.name.should.equal('Updated ServiceRequest');
          serviceRequest.info.should.equal('This is the updated serviceRequest!!!');

          done();
        });
    });
  });

  describe('PATCH /api/serviceRequests/:id', function() {
    var patchedServiceRequest;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/serviceRequests/${newServiceRequest._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched ServiceRequest' },
          { op: 'replace', path: '/info', value: 'This is the patched serviceRequest!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedServiceRequest = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedServiceRequest = {};
    });

    it('should respond with the patched serviceRequest', function() {
      patchedServiceRequest.name.should.equal('Patched ServiceRequest');
      patchedServiceRequest.info.should.equal('This is the patched serviceRequest!!!');
    });
  });

  describe('DELETE /api/serviceRequests/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/serviceRequests/${newServiceRequest._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when serviceRequest does not exist', function(done) {
      request(app)
        .delete(`/api/serviceRequests/${newServiceRequest._id}`)
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
