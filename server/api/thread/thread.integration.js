 'use strict';

var app = require('../..');
import request from 'supertest';
import {communityDetails} from '../community/community.integration.js';
import {residentDetails} from '../complaint/complaint.integration.js';

var newthread;
var residentToken; 
var newCommunity = communityDetails(); 


describe('Thread API:', function() {

  describe('POST /api/threads/addYourThread', function() {
     beforeEach(function(done) {
      var residentToken = residentDetails(); 
      var req = request(app).post('/api/threads/addYourThread')
         req.cookies = residentToken;
         req.send({
                    title:'Amazon1',
                    description:'A2Z products are available1',
                    topicTitle:'Best site for shopping1'   
        })
        req.expect(201)
        //.expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newthread = res.body; 
          done();
        });
     });

    it('should respond with the newthread', function() {
      newthread.title == 'Amazon1';
    });
  });
  
  describe('POST /api/threads/deleteThread', function() {
    var newThread;
    beforeEach(function(done) {
      var residentToken = residentDetails();
                //var communityInfo = communityDetails(); 
    var req =request(app).post('/api/threads/deleteThread');
    req.cookies = residentToken;
        req.send({
           userId: newthread.userId,
           threadId: newthread.threadId
        })
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newThread = res.body;
          done();
        });
    });

    it('should respond with the newly deleted thread', function() {
      // newThread.userId == 1003;
      //newThread.info.should.equal('This is the brand new thread!!!');
    });

  });
});

export function threadid() {
  return newthread
}