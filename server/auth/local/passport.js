import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

function localAuthenticate(User, email, password, done) {
    User.findOne({
            email: email.toLowerCase()
        }).exec()
        .then(user => {
            if (!user) {
                return done(null, false, {
                    message: 'Email is not registered.'
                });
            }
            user.authenticate(user, password, function(authError, authenticated) {
                if (authError) {
                    return done(authError);
                }
                if (!authenticated) {
                    if (user.lockUntil > Date.now()) {
                        return done(null, false, { message: 'Max Attempts Exceeded Try After A Minute' });
                    } else if (user.loginAttempts >= 4) {
                        return done(null, false, { message: 'Max Attempts Exceeded ' });
                    } else if (user.loginAttempts <= 3) {
                        return done(null, false, { message: 'Password is not correct. It Will Be Blocked After'+ (4-user.loginAttempts)+' Attempts' });
                    }
                } else {
                    return done(null, user);
                }
            });
        })
        .catch(err => done(err));
}

export function setup(User, config) {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password' // this is the virtual field on the model
    }, function(email, password, done) {
        return localAuthenticate(User, email, password, done);
    }));
}
