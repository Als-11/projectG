'use strict';

var app = require('../..');
import request from 'supertest';
import {communityDetails} from '../community/community.integration.js';

var newAmenity;

describe('Amenity API:', function() {

  describe('POST /api/amenities ', function() {
    beforeEach(function(done) {
      var communityInfo = communityDetails();
      request(app)
        .post('/api/amenities')
        .send({
                 'amenityName' : 'Gym',
                 'description' :'fdnbvfvsk',
                 'chargePerHour': '20',
                 'contactPerson': {
                   'name': 'Surya',
                   'contactPhone': 3698521470
                },
                 'adminCommunityId': communityInfo.communityId
             })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newAmenity = res.body;
          done();
        });
    });

    it('should respond with the newly created amenity', function() {
      newAmenity.amenityName == 'Gym';
    });

  });

  describe('POST /api/amenities/deleteAmenity', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/amenities/deleteAmenity')
        .send({
          amenityId:newAmenity.amenityId
             })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newAmenity = res.body;
          done();
        });
    });

    it('should respond with the newly created amenity', function() {
      //newAmenity.amenityId == 1001;
    });

  });

//   describe('GET /api/amenities/:id', function() {
//     var amenity;

//     beforeEach(function(done) {
//       request(app)
//         .get('/api/amenities/' + newAmenity._id)
//         .expect(200)
//         .expect('Content-Type', /json/)
//         .end((err, res) => {
//           if (err) {
//             return done(err);
//           }
//           amenity = res.body;
//           done();
//         });
//     });

//     afterEach(function() {
//       amenity = {};
//     });

//     it('should respond with the requested amenity', function() {
//       amenity.name.should.equal('New Amenity');
//       amenity.info.should.equal('This is the brand new amenity!!!');
//     });

//   });

//   describe('PUT /api/amenities/:id', function() {
//     var updatedAmenity;

//     beforeEach(function(done) {
//       request(app)
//         .put('/api/amenities/' + newAmenity._id)
//         .send({
//           name: 'Updated Amenity',
//           info: 'This is the updated amenity!!!'
//         })
//         .expect(200)
//         .expect('Content-Type', /json/)
//         .end(function(err, res) {
//           if (err) {
//             return done(err);
//           }
//           updatedAmenity = res.body;
//           done();
//         });
//     });

//     afterEach(function() {
//       updatedAmenity = {};
//     });

//     it('should respond with the updated amenity', function() {
//       updatedAmenity.name.should.equal('Updated Amenity');
//       updatedAmenity.info.should.equal('This is the updated amenity!!!');
//     });

//   });

//   describe('DELETE /api/amenities/:id', function() {

//     it('should respond with 204 on successful removal', function(done) {
//       request(app)
//         .delete('/api/amenities/' + newAmenity._id)
//         .expect(204)
//         .end((err, res) => {
//           if (err) {
//             return done(err);
//           }
//           done();
//         });
//     });

//     it('should respond with 404 when amenity does not exist', function(done) {
//       request(app)
//         .delete('/api/amenities/' + newAmenity._id)
//         .expect(404)
//         .end((err, res) => {
//           if (err) {
//             return done(err);
//           }
//           done();
//         });
//     });

//   });

 });