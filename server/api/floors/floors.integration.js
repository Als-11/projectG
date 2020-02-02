'use strict';

var app = require('../..');
import request from 'supertest';

var newFloors;

describe('Floors API:', function() {

  describe('GET /api/floors', function() {
    var floorss;

    beforeEach(function(done) {
      request(app)
        .get('/api/floors')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          floorss = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      floorss.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/floors', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/floors')
        .send({
          name: 'New Floors',
          info: 'This is the brand new floors!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newFloors = res.body;
          done();
        });
    });

    it('should respond with the newly created floors', function() {
      newFloors.name.should.equal('New Floors');
      newFloors.info.should.equal('This is the brand new floors!!!');
    });

  });

  describe('GET /api/floors/:id', function() {
    var floors;

    beforeEach(function(done) {
      request(app)
        .get('/api/floors/' + newFloors._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          floors = res.body;
          done();
        });
    });

    afterEach(function() {
      floors = {};
    });

    it('should respond with the requested floors', function() {
      floors.name.should.equal('New Floors');
      floors.info.should.equal('This is the brand new floors!!!');
    });

  });

  describe('PUT /api/floors/:id', function() {
    var updatedFloors;

    beforeEach(function(done) {
      request(app)
        .put('/api/floors/' + newFloors._id)
        .send({
          name: 'Updated Floors',
          info: 'This is the updated floors!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedFloors = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedFloors = {};
    });

    it('should respond with the updated floors', function() {
      updatedFloors.name.should.equal('Updated Floors');
      updatedFloors.info.should.equal('This is the updated floors!!!');
    });

  });

  describe('DELETE /api/floors/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/floors/' + newFloors._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when floors does not exist', function(done) {
      request(app)
        .delete('/api/floors/' + newFloors._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
