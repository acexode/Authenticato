const passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    GoogleStrategy = require('passport-google-oauth20').Strategy;

// model
const providers = require('../model/providers');

//facebook strategy
passport.use(new FacebookStrategy({
        clientID: '836470273168140',
        clientSecret: '3f337fb136f5d43f3a1a89e26b3cfbb5',
        callbackURL: "http://localhost:3000/users/facebook/callback",
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
        consumerKey: 'cc2fDdjTifXj8Sao6ew6T4TWx',
        consumerSecret: 'uTj6CtqgkR1soMwOKA7rt9HKOYK5ahPZ8nbQpj1xF4Vap0Q0GB',
        callbackURL: "http://localhost:3000/users/twitter/callback"
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
        clientID: '256025151636-rhkhde8vnq5s28or00um3mhtmc7j1n68.apps.googleusercontent.com',
        clientSecret: 'w-xgz9JAcIiJY772xswwdeVU',
        callbackURL: 'http://localhost:3000/users/google/callback'
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

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    providers.findById(id, function(err, user) {
        done(err, user);
    });

});