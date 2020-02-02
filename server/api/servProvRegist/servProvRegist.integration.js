'use strict';

var app = require('../..');
import request from 'supertest';

var newServProvRegist;

describe('ServProvRegist API:', function() {
  describe('GET /api/servProvRegists', function() {
    var servProvRegists;

    beforeEach(function(done) {
      request(app)
        .get('/api/servProvRegists')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          servProvRegists = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      servProvRegists.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/servProvRegists', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/servProvRegists')
        .send({
          name: 'New ServProvRegist',
          info: 'This is the brand new servProvRegist!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newServProvRegist = res.body;
          done();
        });
    });

    it('should respond with the newly created servProvRegist', function() {
      newServProvRegist.name.should.equal('New ServProvRegist');
      newServProvRegist.info.should.equal('This is the brand new servProvRegist!!!');
    });
  });

  describe('GET /api/servProvRegists/:id', function() {
    var servProvRegist;

    beforeEach(function(done) {
      request(app)
        .get(`/api/servProvRegists/${newServProvRegist._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          servProvRegist = res.body;
          done();
        });
    });

    afterEach(function() {
      servProvRegist = {};
    });

    it('should respond with the requested servProvRegist', function() {
      servProvRegist.name.should.equal('New ServProvRegist');
      servProvRegist.info.should.equal('This is the brand new servProvRegist!!!');
    });
  });

  describe('PUT /api/servProvRegists/:id', function() {
    var updatedServProvRegist;

    beforeEach(function(done) {
      request(app)
        .put(`/api/servProvRegists/${newServProvRegist._id}`)
        .send({
          name: 'Updated ServProvRegist',
          info: 'This is the updated servProvRegist!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedServProvRegist = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedServProvRegist = {};
    });

    it('should respond with the original servProvRegist', function() {
      updatedServProvRegist.name.should.equal('New ServProvRegist');
      updatedServProvRegist.info.should.equal('This is the brand new servProvRegist!!!');
    });

    it('should respond with the updated servProvRegist on a subsequent GET', function(done) {
      request(app)
        .get(`/api/servProvRegists/${newServProvRegist._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let servProvRegist = res.body;

          servProvRegist.name.should.equal('Updated ServProvRegist');
          servProvRegist.info.should.equal('This is the updated servProvRegist!!!');

          done();
        });
    });
  });

  describe('PATCH /api/servProvRegists/:id', function() {
    var patchedServProvRegist;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/servProvRegists/${newServProvRegist._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched ServProvRegist' },
          { op: 'replace', path: '/info', value: 'This is the patched servProvRegist!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedServProvRegist = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedServProvRegist = {};
    });

    it('should respond with the patched servProvRegist', function() {
      patchedServProvRegist.name.should.equal('Patched ServProvRegist');
      patchedServProvRegist.info.should.equal('This is the patched servProvRegist!!!');
    });
  });

  describe('DELETE /api/servProvRegists/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/servProvRegists/${newServProvRegist._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when servProvRegist does not exist', function(done) {
      request(app)
        .delete(`/api/servProvRegists/${newServProvRegist._id}`)
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
