'use strict';

var app = require('../..');
import request from 'supertest';

var newNotifications;

describe('Notifications API:', function() {

  describe('GET /api/notificationss', function() {
    var notificationss;

    beforeEach(function(done) {
      request(app)
        .get('/api/notificationss')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          notificationss = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      notificationss.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/notificationss', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/notificationss')
        .send({
          name: 'New Notifications',
          info: 'This is the brand new notifications!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newNotifications = res.body;
          done();
        });
    });

    it('should respond with the newly created notifications', function() {
      newNotifications.name.should.equal('New Notifications');
      newNotifications.info.should.equal('This is the brand new notifications!!!');
    });

  });

  describe('GET /api/notificationss/:id', function() {
    var notifications;

    beforeEach(function(done) {
      request(app)
        .get('/api/notificationss/' + newNotifications._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          notifications = res.body;
          done();
        });
    });

    afterEach(function() {
      notifications = {};
    });

    it('should respond with the requested notifications', function() {
      notifications.name.should.equal('New Notifications');
      notifications.info.should.equal('This is the brand new notifications!!!');
    });

  });

  describe('PUT /api/notificationss/:id', function() {
    var updatedNotifications;

    beforeEach(function(done) {
      request(app)
        .put('/api/notificationss/' + newNotifications._id)
        .send({
          name: 'Updated Notifications',
          info: 'This is the updated notifications!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedNotifications = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedNotifications = {};
    });

    it('should respond with the updated notifications', function() {
      updatedNotifications.name.should.equal('Updated Notifications');
      updatedNotifications.info.should.equal('This is the updated notifications!!!');
    });

  });

  describe('DELETE /api/notificationss/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/notificationss/' + newNotifications._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when notifications does not exist', function(done) {
      request(app)
        .delete('/api/notificationss/' + newNotifications._id)
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
