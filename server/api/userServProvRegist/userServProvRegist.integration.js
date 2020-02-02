'use strict';

var app = require('../..');
import request from 'supertest';

var newUserServProvRegist;

describe('UserServProvRegist API:', function() {
  describe('GET /api/userServProvRegists', function() {
    var userServProvRegists;

    beforeEach(function(done) {
      request(app)
        .get('/api/userServProvRegists')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          userServProvRegists = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      userServProvRegists.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/userServProvRegists', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/userServProvRegists')
        .send({
          name: 'New UserServProvRegist',
          info: 'This is the brand new userServProvRegist!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newUserServProvRegist = res.body;
          done();
        });
    });

    it('should respond with the newly created userServProvRegist', function() {
      newUserServProvRegist.name.should.equal('New UserServProvRegist');
      newUserServProvRegist.info.should.equal('This is the brand new userServProvRegist!!!');
    });
  });

  describe('GET /api/userServProvRegists/:id', function() {
    var userServProvRegist;

    beforeEach(function(done) {
      request(app)
        .get(`/api/userServProvRegists/${newUserServProvRegist._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          userServProvRegist = res.body;
          done();
        });
    });

    afterEach(function() {
      userServProvRegist = {};
    });

    it('should respond with the requested userServProvRegist', function() {
      userServProvRegist.name.should.equal('New UserServProvRegist');
      userServProvRegist.info.should.equal('This is the brand new userServProvRegist!!!');
    });
  });

  describe('PUT /api/userServProvRegists/:id', function() {
    var updatedUserServProvRegist;

    beforeEach(function(done) {
      request(app)
        .put(`/api/userServProvRegists/${newUserServProvRegist._id}`)
        .send({
          name: 'Updated UserServProvRegist',
          info: 'This is the updated userServProvRegist!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedUserServProvRegist = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedUserServProvRegist = {};
    });

    it('should respond with the original userServProvRegist', function() {
      updatedUserServProvRegist.name.should.equal('New UserServProvRegist');
      updatedUserServProvRegist.info.should.equal('This is the brand new userServProvRegist!!!');
    });

    it('should respond with the updated userServProvRegist on a subsequent GET', function(done) {
      request(app)
        .get(`/api/userServProvRegists/${newUserServProvRegist._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let userServProvRegist = res.body;

          userServProvRegist.name.should.equal('Updated UserServProvRegist');
          userServProvRegist.info.should.equal('This is the updated userServProvRegist!!!');

          done();
        });
    });
  });

  describe('PATCH /api/userServProvRegists/:id', function() {
    var patchedUserServProvRegist;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/userServProvRegists/${newUserServProvRegist._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched UserServProvRegist' },
          { op: 'replace', path: '/info', value: 'This is the patched userServProvRegist!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedUserServProvRegist = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedUserServProvRegist = {};
    });

    it('should respond with the patched userServProvRegist', function() {
      patchedUserServProvRegist.name.should.equal('Patched UserServProvRegist');
      patchedUserServProvRegist.info.should.equal('This is the patched userServProvRegist!!!');
    });
  });

  describe('DELETE /api/userServProvRegists/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/userServProvRegists/${newUserServProvRegist._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when userServProvRegist does not exist', function(done) {
      request(app)
        .delete(`/api/userServProvRegists/${newUserServProvRegist._id}`)
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
