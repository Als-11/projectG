'use strict';

var app = require('../..');
import request from 'supertest';

var newTypesForService;

describe('TypesForService API:', function() {
  describe('GET /api/typesForServices', function() {
    var typesForServices;

    beforeEach(function(done) {
      request(app)
        .get('/api/typesForServices')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          typesForServices = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      typesForServices.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/typesForServices', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/typesForServices')
        .send({
          name: 'New TypesForService',
          info: 'This is the brand new typesForService!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newTypesForService = res.body;
          done();
        });
    });

    it('should respond with the newly created typesForService', function() {
      newTypesForService.name.should.equal('New TypesForService');
      newTypesForService.info.should.equal('This is the brand new typesForService!!!');
    });
  });

  describe('GET /api/typesForServices/:id', function() {
    var typesForService;

    beforeEach(function(done) {
      request(app)
        .get(`/api/typesForServices/${newTypesForService._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          typesForService = res.body;
          done();
        });
    });

    afterEach(function() {
      typesForService = {};
    });

    it('should respond with the requested typesForService', function() {
      typesForService.name.should.equal('New TypesForService');
      typesForService.info.should.equal('This is the brand new typesForService!!!');
    });
  });

  describe('PUT /api/typesForServices/:id', function() {
    var updatedTypesForService;

    beforeEach(function(done) {
      request(app)
        .put(`/api/typesForServices/${newTypesForService._id}`)
        .send({
          name: 'Updated TypesForService',
          info: 'This is the updated typesForService!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedTypesForService = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedTypesForService = {};
    });

    it('should respond with the original typesForService', function() {
      updatedTypesForService.name.should.equal('New TypesForService');
      updatedTypesForService.info.should.equal('This is the brand new typesForService!!!');
    });

    it('should respond with the updated typesForService on a subsequent GET', function(done) {
      request(app)
        .get(`/api/typesForServices/${newTypesForService._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let typesForService = res.body;

          typesForService.name.should.equal('Updated TypesForService');
          typesForService.info.should.equal('This is the updated typesForService!!!');

          done();
        });
    });
  });

  describe('PATCH /api/typesForServices/:id', function() {
    var patchedTypesForService;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/typesForServices/${newTypesForService._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched TypesForService' },
          { op: 'replace', path: '/info', value: 'This is the patched typesForService!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedTypesForService = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedTypesForService = {};
    });

    it('should respond with the patched typesForService', function() {
      patchedTypesForService.name.should.equal('Patched TypesForService');
      patchedTypesForService.info.should.equal('This is the patched typesForService!!!');
    });
  });

  describe('DELETE /api/typesForServices/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/typesForServices/${newTypesForService._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when typesForService does not exist', function(done) {
      request(app)
        .delete(`/api/typesForServices/${newTypesForService._id}`)
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
