'use strict';

import app from '../..';
import User from './user.model';
import request from 'supertest';
import Community from '../community/community.model';

var user;
  var finalToken;
  var token;
  var newCommunity;

describe('User API:', function() {

  // after(function() {      //cleans a  user after the test
  //   return User.remove();
  // });

  // after(function()  {  //cleans a community after test
  //    return Community.remove();
  // });

  describe('GET /api/users/me', function() {

    before(function(done) {
      request(app)
        .post('/auth/local')
        .send({
          email: 'test@guwha.com',
          password: '123456789'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => { 
        var sid = res.headers['set-cookie'].pop().split(';')[0];
          token = res.body.token;
          finalToken="connect.sid="+sid+";token="+token; 
          done();
        });
    });

    it('should respond with a user profile when authenticated', function(done) {
      request(app)
        .get('/api/users/me')
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          done();
        });
    });

    it('should respond with a 401 when not authenticated', function(done) {
      request(app)
        .get('/api/users/me')
        .expect(401)
        .end(done);
    });
  });

    describe('Adding a blocks in community', function() {         //adding a block
     it("newly created community",function(done)
     {
       var req = request(app).post('/api/community/blocks')
      finalToken = getToken();
      req.cookies = finalToken;
      req.send({
          blocks: {
                      blockName : 'GuwhaBlock'
                  }
        })
        req.expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) { 
            return done(err);
          }

         newCommunity = res.body;
          done();
        });
     });
   });


  describe('adding a floors ', function() {  //adding a floor
     it('Adding a floor',function(done) {
     var req = request(app).post('/api/community/floors')
      finalToken = getToken();
      req.cookies = finalToken
        req.send({
                blockName: "GuwhaBlock",
                floors: [{
                            'floorNumber': 1,
                            'flatNumbers': ["101","102","103"]
                        }]
            })
        req.expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
            newCommunity = res.body;
          if (err) {
            return done(err);
          }
  
          done();
        });
    });
  });

   describe('POST /api/community/setSecurityLevel', function() {  //get selected blocks
    var communitys;
    beforeEach(function(done) {
      var req = request(app).post('/api/community/setSecurityLevel')
       finalToken = getToken();
      req.cookies = finalToken 
      req.send({
           securityLevel:'STRICT'
        })
        req.expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          communitys = res.body;
          done();
        });
    });

    it('should respond selectedblocks', function() {
      communitys.securityLevel == 'STRICT';
    });

  });

describe('POST /api/users/changeprofile', function() 
   {
    var newdata = [];
     beforeEach(function(done) {      
      finalToken = getToken();
      var req = request(app).post('/api/users/changeprofile')
      req.cookies = finalToken;
        req.send({
          newName: 'jithendrccda',
          // emailId: 'rjithendra287@gmail.com',
          phoneNumber: '9666454603'
        })
        req.expect(200)
        .end((err, res) => { 
          if(err){ 

          return done(err);
        }
        else{
          newdata = res.body; 
        }        
        });  
        done(); 

    });

    it('should respond with emailId', function() {
      newdata.firstName == 'jithendrccda';
  });
}); 

// describe('PUT /api/users/password', function() 
//    {
    
//      beforeEach(function(done) {
//       request(app)
//         .put('/api/users/password')
//         .send({
//           userId : 
//           oldPassword : 'password',
//           newpassword : 'password1'
//         })
//         .expect(201)
//         .end((err, res) => { 
//           // userid = req.body.userId;
//           return (err);
//           // token = res.body.token;
//         });
//         done();
//     });
//     it('should respond with visitor creation', function() {
//   });
// });

describe('POST /api/users/profile', function() 
   {
     beforeEach(function(done) {
      finalToken = getToken();
      var req = request(app).post('/api/users/profile')
      req.cookies = finalToken;
        req.expect(200)
        .end((err, res) => { 
          return (err);
        });
        done();
    });
    it('should respond with user profile', function() {
  });
}); 

});

export function getToken() {
     return finalToken;
}
export function tokenForApproval(){
  return token;
}