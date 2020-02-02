 'use strict';

var app = require('../..');
import request from 'supertest';
import {communityDetails} from '../community/community.integration.js';
import {getToken} from '../user/user.integration.js';
import {tokenForApproval} from '../user/user.integration.js';


var finalToken;
var newApproval;
var token;
var residentToken;


describe('Approval API:', function() {

    describe('POST /api/approvals', function() {
    beforeEach(function(done) {
      var communityInfo = communityDetails();
         request(app)
        .post('/api/approvals')
        .send({
                          communityName:'New Community',
                          userName:'SuriyaR',
                          blockName:'mbrs',
                          floorNumber:512 ,
                          emailId:'resident@guwha.com',
                          flatNumber:212,
                          phoneNumber:9989334027,
                          communityId:communityInfo.communityId
                   
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newApproval = res.body;
          done();
        });
    });

    it('should respond with the newly created approval', function() {
      newApproval.firstname == 'SuriyaR';
      //newApproval.communityId == 1911;
    });
  });

    describe('GET /api/users/activeUsersCount', function() {
    var token;
    var activeuserscount;

    beforeEach(function(done) {
      finalToken = getToken();
      var req = request(app).get('/api/users/activeUsersCount')
      req.cookies = finalToken;
        req.expect(200)
        .end((err, res) => { 
           activeuserscount = res.body;
          return (err);
          // token = res.body.token;
        });
        done();
    });
    it('should respond with active users count', function() {
      activeuserscount == 0;
  });
});

  describe('POST /api/approvals/approveUser', function() {
    beforeEach(function(done) {
      var finalToken = getToken();
      var  req =  request(app).post('/api/approvals/approveUser')
      req.cookies = finalToken;
        req.send({
                          emailId:'resident@guwha.com',
                          userName:'Suriya',
                          lastname:'Rprasad',
                          phoneNumber:9989334027,
                          blockName:'mbrs',
                          flatNumber:"222"
             })
        req.expect(200)
        // .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }      
          newApproval = res.body;
          done();
        });
    });

    it('should respond with the newly created approval', function() {
      newApproval.firstname == 'Suriya';
      //newApproval.communityId == 1009;
    });
  });



  describe('POST /api/approvals/rejectuser', function() {
    beforeEach(function() {
      var finalToken = getToken();
      var  req =  request(app).post('/api/approvals/rejectuser')
      req.cookies = finalToken;
        req.send({
               emailId:'rsmb@als.com'
        })
        .expect(404)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return err;
          }
          newApproval = res.body;
          //done();
        });
    });

    it('should respond with the newly created approval', function() {
      newApproval.emailId == 'rsmb@als.com';
      //newApproval.communityId == 1911;
    });
  });
  describe('POST /api/approvals/getApprovals', function() {
    beforeEach(function(done) {
          var communityInfo = communityDetails();
      request(app)
        .post('/api/approvals/getApprovals')
        .send({
                          communityId:communityInfo.communityId
                          //approvalStatus:""
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newApproval = res.body;
          done();
        });
    });

    it('should respond with the newly created approval', function() {
                var communityInfo = communityDetails();
      newApproval.communityId == communityInfo.communityId;
    });
  });

  describe('POST /api/approvals/inactive', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/approvals/inactive')
        .send({
                          //communityId:1009
                          //approvalStatus:""
        })
        .expect(404)
        //.expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newApproval = res.body;
          done();
        });
    });

    it('should respond with the newly created approval', function() {
      //newApproval.firstname == 'Surya'
    });
  });

 describe('GET /api/users/activeUsersCount', function() {
    var token;
    var activeuserscount;

    beforeEach(function(done) {
      finalToken = getToken();
      var req = request(app).get('/api/users/activeUsersCount')
      req.cookies = finalToken;
        req.expect(200)
        .end((err, res) => { 
           activeuserscount = res.body;
          return (err);
          // token = res.body.token;
        });
        done();
    });
    it('should respond with active users count', function() {
      activeuserscount == 1;
  });
});

   describe('GET /api/users/activeusers', function() 
   {
    var activeuser;
     it('should respond with activeusers',function(done) {
      finalToken = getToken();
      var activeusertoken = tokenForApproval();
      var access_token = "access_token="+activeusertoken; 
      var reqObj = request(app);
      var req = reqObj.get('/api/users/activeusers?'+access_token) ; 
      req.cookies = finalToken;      
        req.expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {   
            if(err){         
          return done(err);
        }
        else{
          activeuser = res.body; 
        }
        });
        done();
    });
});

describe('POST /api/users/getemails', function() 
   {
    var emailcount;
    
     beforeEach(function(done) {
      finalToken = getToken();
      var req = request(app).post('/api/users/getemails')
      req.cookies = finalToken;
        req.send({
          emailId : 'resident@guwha.com'
        })
        .expect(200)
        .end((err, res) => { 
          emailcount = res.body;
          return (err);
          // token = res.body.token;
        });
        done();
    });
    it('should respond with emailId', function() {
      emailcount == 1;
  });
});

describe('POST /api/users/setVisitor', function() 
   {
    var userid;
    var houseNumber;
     it('should respond with visitor creation', function(done) {
      finalToken = getToken();
      var req = request(app).post('/api/users/setVisitor')
      req.cookies = finalToken;
        req.send({
          houseNumber : 'mbrs-222'
        })
        .expect(200)
        .end((err, res) => {
           if(err){
            return err
           }
          
        });
        done();
    });    
});


});