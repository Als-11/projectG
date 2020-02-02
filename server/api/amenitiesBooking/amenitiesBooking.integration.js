'use strict';

var app = require('../..');
import request from 'supertest';

var newAmenitiesBooking;

describe('AmenitiesBooking API:', function() {

  describe('GET /api/amenitiesBookings', function() {
    var amenitiesBookings;

    beforeEach(function(done) {
      request(app)
        .get('/api/amenitiesBookings')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          amenitiesBookings = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      amenitiesBookings.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/amenitiesBookings', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/amenitiesBookings')
        .send({
          name: 'New AmenitiesBooking',
          info: 'This is the brand new amenitiesBooking!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newAmenitiesBooking = res.body;
          done();
        });
    });

    it('should respond with the newly created amenitiesBooking', function() {
      newAmenitiesBooking.name.should.equal('New AmenitiesBooking');
      newAmenitiesBooking.info.should.equal('This is the brand new amenitiesBooking!!!');
    });

  });

  describe('GET /api/amenitiesBookings/:id', function() {
    var amenitiesBooking;

    beforeEach(function(done) {
      request(app)
        .get('/api/amenitiesBookings/' + newAmenitiesBooking._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          amenitiesBooking = res.body;
          done();
        });
    });

    afterEach(function() {
      amenitiesBooking = {};
    });

    it('should respond with the requested amenitiesBooking', function() {
      amenitiesBooking.name.should.equal('New AmenitiesBooking');
      amenitiesBooking.info.should.equal('This is the brand new amenitiesBooking!!!');
    });

  });

  describe('PUT /api/amenitiesBookings/:id', function() {
    var updatedAmenitiesBooking;

    beforeEach(function(done) {
      request(app)
        .put('/api/amenitiesBookings/' + newAmenitiesBooking._id)
        .send({
          name: 'Updated AmenitiesBooking',
          info: 'This is the updated amenitiesBooking!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedAmenitiesBooking = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedAmenitiesBooking = {};
    });

    it('should respond with the updated amenitiesBooking', function() {
      updatedAmenitiesBooking.name.should.equal('Updated AmenitiesBooking');
      updatedAmenitiesBooking.info.should.equal('This is the updated amenitiesBooking!!!');
    });

  });

  describe('DELETE /api/amenitiesBookings/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/amenitiesBookings/' + newAmenitiesBooking._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when amenitiesBooking does not exist', function(done) {
      request(app)
        .delete('/api/amenitiesBookings/' + newAmenitiesBooking._id)
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
