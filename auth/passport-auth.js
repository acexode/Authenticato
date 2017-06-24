//passport fb, twitter, goog and local strategy

const passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    GoogleStrategy = require('passport-google-oauth20').Strategy,
    LocalStrategy = require('passport-local').Strategy;

// configs
config = require('./config')

// model
const providers = require('../model/providers');

//facebook strategy
passport.use(new FacebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL,
        profileFields: ['id', 'name', 'email', 'gender', 'displayName']
    },
    function(accessToken, refreshToken, profile, done) {
        providers.findOne({ 'facebook.id': profile.id }, function(err, user) {
            if (err) { return done(err); }
            if (user) {
                done(null, user);
            } else {
                const newUser = new providers;
                newUser.facebook.id = profile.id
                newUser.facebook.token = accessToken
                newUser.facebook.username = profile.name.givenName + ' ' + profile.name.familyName;
                newUser.facebook.email = profile.emails[0].value;
                newUser.save((err) => {
                    if (err) throw err;
                    return done(null, newUser)
                })
            }
        });
    }
));

// twitter Strategy
passport.use(new TwitterStrategy({
        consumerKey: config.twitter.consumerKey,
        consumerSecret: config.twitter.consumerSecret,
        callbackURL: config.twitter.callbackURL
    },
    function(token, tokenSecret, profile, done) {
        providers.findOne({ 'twitter.id': profile.id }, function(err, user) {
            if (err) { return done(err); }
            if (user) {
                done(null, user);
            } else {
                console.log(profile)
                const newUser = new providers;
                newUser.twitter.id = profile.id
                newUser.twitter.token = token
                newUser.twitter.username = profile.username;
                newUser.twitter.displayName = profile.displayName;
                newUser.twitter.photos = profile.photos[0].value;
                newUser.save((err) => {
                    if (err) throw err;
                    return done(null, newUser)
                })
            }
        });
    }
));

//google  Strategy
passport.use(new GoogleStrategy({
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        providers.findOne({ 'google.id': profile.id }, function(err, user) {
            if (err) { return done(err) };
            if (user) {
                done(err, user);
            } else {
                console.log(profile)
                const newUser = new providers;
                newUser.google.id = profile.id
                newUser.google.token = accessToken
                newUser.google.username = profile.username;
                newUser.google.displayName = profile.displayName;
                newUser.google.photos = profile.photos[0].value;
                newUser.save((err) => {
                    if (err) throw err;
                    return done(null, newUser)
                })
            }
        });
    }
));
/* local  strategy*/

passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    function(username, password, done) {
        console.log(username)
        providers.findOne({ 'local.username': username }, function(err, user) {
            console.log(user.local.password)
            if (err) {
                console.log(err);
                return done(err);
            }
            if (!user) {
                console.log('unknown user')
                return done(null, false, { message: 'unknow user' });

            } else {
                providers.validPassword(password, user.local.password, function(err, match) {
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
    providers.findById(id, function(err, user) {
        done(err, user);
    });

});