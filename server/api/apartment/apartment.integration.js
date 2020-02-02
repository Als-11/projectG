'use strict';

var app = require('../..');
import request from 'supertest';

var newApartment;

describe('Apartment API:', function() {

  describe('GET /api/apartments', function() {
    var apartments;

    beforeEach(function(done) {
      request(app)
        .get('/api/apartments')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          apartments = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      apartments.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/apartments', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/apartments')
        .send({
          name: 'New Apartment',
          info: 'This is the brand new apartment!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newApartment = res.body;
          done();
        });
    });

    it('should respond with the newly created apartment', function() {
      newApartment.name.should.equal('New Apartment');
      newApartment.info.should.equal('This is the brand new apartment!!!');
    });

  });

  describe('GET /api/apartments/:id', function() {
    var apartment;

    beforeEach(function(done) {
      request(app)
        .get('/api/apartments/' + newApartment._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          apartment = res.body;
          done();
        });
    });

    afterEach(function() {
      apartment = {};
    });

    it('should respond with the requested apartment', function() {
      apartment.name.should.equal('New Apartment');
      apartment.info.should.equal('This is the brand new apartment!!!');
    });

  });

  describe('PUT /api/apartments/:id', function() {
    var updatedApartment;

    beforeEach(function(done) {
      request(app)
        .put('/api/apartments/' + newApartment._id)
        .send({
          name: 'Updated Apartment',
          info: 'This is the updated apartment!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedApartment = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedApartment = {};
    });

    it('should respond with the updated apartment', function() {
      updatedApartment.name.should.equal('Updated Apartment');
      updatedApartment.info.should.equal('This is the updated apartment!!!');
    });

  });

  describe('DELETE /api/apartments/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/apartments/' + newApartment._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when apartment does not exist', function(done) {
      request(app)
        .delete('/api/apartments/' + newApartment._id)
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
