'use strict';

var app = require('../..');
import request from 'supertest';
import Community from './community.model';
// import {getToken} from '../user/user.integration.js'

var newCommunity;
var response = [];
 var cookies;
var finalToken;
describe('Community API:', function() {
  
describe('Adding a Community', function() {        //adding a community

    it('should respond with the newly created community', function(done) {
      request(app)
        .post('/api/community')
        .send({
          communityName: 'New Community',
          address: { 
                  address1: 'whitehouse',
                  address2: 'avenue colony',
                  locality: 'roopa apartments',
                  landmark: 'near mainroad',
                  city: "WashingtonDC",
                  pincode: "524201"
                  },
          emailId:'test@guwha.com',
          password:'123456789',
          phoneNumber:'8143381405'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          // if (err) {
          //   return done(err);
          // } 
          newCommunity = res.body; 
          done();
       });
    });

        it('should response already community is created',function()
        {
          request(app)
          .post('/api/community')
          .send({
          communityName: 'New Community',
          address: { 
                  address1: 'whitehouse',
                  address2: 'avenue colony',
                  locality: 'roopa apartments',
                  landmark: 'near mainroad',
                  city: "WashingtonDC",
                  pincode: "524201"
                  },
          emailId:'test@guwha.com',
          password:"123456789",
          phoneNumber:'8143381405'
        })
         .expect(500)
         .end((err,res)=>{
           if(err){
            return err;
          }
        });
      });

  });

describe('POST /api/community/suggestions', function() {  //search communities
      
    beforeEach(function(done) {
      request(app)
        .post('/api/community/suggestions')
        .send({
          keyword :'N'
        })
        .expect(200)
        // .expect('Content-Type', /json/)
        .end((err, res) => { 
        response.push(res.body); 
          if (err) {
            return done(err);
          }
          done();
        });

    });

    it('show communityName', function() {
        response[0].communityName == 'New Community';  
    });

  });

describe('POST /api/community/getCommunityBlocks', function() {  //get selected blocks
    var communitys;
    beforeEach(function(done) {
      request(app)
        .post('/api/community/getCommunityBlocks')
        .send({
           communityName : "New Community",
           address1 :"whitehouse" ,
           locality:"roopa apartments"
        })
        .expect(200)
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
      communitys.blocks.blockName == 'GuwhaBlock';
    });

  });

});

export function communityDetails() {
  return newCommunity;
} 
