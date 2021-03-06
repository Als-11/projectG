'use strict';

import express from 'express';
import passport from 'passport';
import {signToken} from '../auth.service';

var router = express.Router();

router.post('/', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    var error = err || info;
    if (error) {
      return res.status(401).json(error);
    }
    if (!user) {
      return res.status(404).json({message: 'Something went wrong, please try again.'});
    } 
     var token = signToken(user._id, user.role,user.communityId,user.userId,user.firstName,user.employeeType); 
    res.json({ token });
  })(req, res, next)
});
  
router.post('/logout', function(req, res, next) {
        // Here we would be destroying the session
        req.session.destroy(); 
    });


export default router;
