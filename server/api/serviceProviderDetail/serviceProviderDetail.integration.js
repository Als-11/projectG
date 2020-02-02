'use strict';

var app = require('../..');
import request from 'supertest';

var newServiceProviderDetail;

describe('ServiceProviderDetail API:', function() {
  describe('GET /api/serviceProviderDetails', function() {
    var serviceProviderDetails;

    beforeEach(function(done) {
      request(app)
        .get('/api/serviceProviderDetails')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          serviceProviderDetails = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      serviceProviderDetails.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/serviceProviderDetails', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/serviceProviderDetails')
        .send({
          name: 'New ServiceProviderDetail',
          info: 'This is the brand new serviceProviderDetail!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newServiceProviderDetail = res.body;
          done();
        });
    });

    it('should respond with the newly created serviceProviderDetail', function() {
      newServiceProviderDetail.name.should.equal('New ServiceProviderDetail');
      newServiceProviderDetail.info.should.equal('This is the brand new serviceProviderDetail!!!');
    });
  });

  describe('GET /api/serviceProviderDetails/:id', function() {
    var serviceProviderDetail;

    beforeEach(function(done) {
      request(app)
        .get(`/api/serviceProviderDetails/${newServiceProviderDetail._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          serviceProviderDetail = res.body;
          done();
        });
    });

    afterEach(function() {
      serviceProviderDetail = {};
    });

    it('should respond with the requested serviceProviderDetail', function() {
      serviceProviderDetail.name.should.equal('New ServiceProviderDetail');
      serviceProviderDetail.info.should.equal('This is the brand new serviceProviderDetail!!!');
    });
  });

  describe('PUT /api/serviceProviderDetails/:id', function() {
    var updatedServiceProviderDetail;

    beforeEach(function(done) {
      request(app)
        .put(`/api/serviceProviderDetails/${newServiceProviderDetail._id}`)
        .send({
          name: 'Updated ServiceProviderDetail',
          info: 'This is the updated serviceProviderDetail!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedServiceProviderDetail = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedServiceProviderDetail = {};
    });

    it('should respond with the original serviceProviderDetail', function() {
      updatedServiceProviderDetail.name.should.equal('New ServiceProviderDetail');
      updatedServiceProviderDetail.info.should.equal('This is the brand new serviceProviderDetail!!!');
    });

    it('should respond with the updated serviceProviderDetail on a subsequent GET', function(done) {
      request(app)
        .get(`/api/serviceProviderDetails/${newServiceProviderDetail._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let serviceProviderDetail = res.body;

          serviceProviderDetail.name.should.equal('Updated ServiceProviderDetail');
          serviceProviderDetail.info.should.equal('This is the updated serviceProviderDetail!!!');

          done();
        });
    });
  });

  describe('PATCH /api/serviceProviderDetails/:id', function() {
    var patchedServiceProviderDetail;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/serviceProviderDetails/${newServiceProviderDetail._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched ServiceProviderDetail' },
          { op: 'replace', path: '/info', value: 'This is the patched serviceProviderDetail!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedServiceProviderDetail = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedServiceProviderDetail = {};
    });

    it('should respond with the patched serviceProviderDetail', function() {
      patchedServiceProviderDetail.name.should.equal('Patched ServiceProviderDetail');
      patchedServiceProviderDetail.info.should.equal('This is the patched serviceProviderDetail!!!');
    });
  });

  describe('DELETE /api/serviceProviderDetails/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/serviceProviderDetails/${newServiceProviderDetail._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when serviceProviderDetail does not exist', function(done) {
      request(app)
        .delete(`/api/serviceProviderDetails/${newServiceProviderDetail._id}`)
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
