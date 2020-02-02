'use strict';

var app = require('../..');
import request from 'supertest';
import {getToken} from '../user/user.integration.js';
import {residentDetails} from '../complaint/complaint.integration.js';

var newCommunitymembersmapping;

describe('Communitymembersmapping API:', function() {

  describe('GET /api/communitymembersmappings/communitymemberslist', function() {
    var communitymembersmappings;

    beforeEach(function(done) {
      var req=request(app).get('/api/communitymembersmappings/communitymemberslist')
      var admin = getToken();
        req.cookies = admin;
        req.expect(200)
        // .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          communitymembersmappings = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      // communitymembersmappings.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/communitymembersmappings/createmember', function() {
    beforeEach(function(done) {
      var communityAdmin = residentDetails();
      var req=request(app).post('/api/communitymembersmappings/createmember')
      req.cookies = communityAdmin;
        req.send({
                                          // fromDate: new Date("2016-12-01T01:00:00.000-06:30"),
                                          // toDate: new Date("2016-12-14"),
                                          name:'als',
                                          emailId:'als23@guwha.com',
                                          userId:1012,
                                          phoneNumber:'9632587410',
                                          roleType:'Secretary'
                })
        req.expect(201)
        // .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) { 
            return done(err);
          } 
          newCommunitymembersmapping = res.body;
          done();
        });
    });

    it('should respond with the newly created communitymembersmapping', function() {
      // newCommunitymembersmapping.name.should.equal('New Communitymembersmapping');
      // newCommunitymembersmapping.info.should.equal('This is the brand new communitymembersmapping!!!');
    });

  });

  describe('GET /api/communitymembersmappings/membersCount', function() {
    var communitymembersmappings =[];
    beforeEach(function(done) {
      var req=request(app).get('/api/communitymembersmappings/membersCount')
      var admin = residentDetails();
        req.cookies = admin;
        req.expect(200)
        // .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) { 
            return done(err);
          } 
          communitymembersmappings = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      // communitymembersmappings.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/communitymembersmappings/updatememberslist', function() {
    beforeEach(function(done) {
      var communityAdmin = getToken();
      var req=request(app).post('/api/communitymembersmappings/updatememberslist')
      req.cookies = communityAdmin;
        req.send({

                                          toDate: new Date("2016-12-14T12:00:00.000-06:30"),
                                          phoneNumber:"9632587410",
                                          communitymemberId:1012
        })
        req.expect(200)
        // .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newCommunitymembersmapping = res.body;
          done();
        });
    });

    it('should respond with the newly created communitymembersmapping', function() {
      // newCommunitymembersmapping.name.should.equal('New Communitymembersmapping');
      // newCommunitymembersmapping.info.should.equal('This is the brand new communitymembersmapping!!!');
    });

  });



   

});
