const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

// model
const Users = require('../model/local');
//const providers = require('../model/providers');

// local strategy
passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    function(username, password, done) {
        console.log(username)
        Users.findOne({ 'username': username }, function(err, user) {
            if (err) {
                console.log(err);
                return done(err);
            }
            if (!user) {
                console.log('unknown user')
                return done(null, false, { message: 'unknow user' });

            } else {
                Users.validPassword(password, user.password, function(err, match) {
                    // match === true 
                    console.log(user.password)

                    if (err) throw err;
                    if (match) {
                        console.log(user.email)
                        return done(null, user)
                    } else {
                        console.log('incorrect password')
                        return done(null, false, { message: 'Incorrect password.' })
                    }
                });
            }

        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    Users.findById(id, function(err, user) {
        done(err, user);
    });

});