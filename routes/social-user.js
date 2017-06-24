//social-login routes
const express = require('express'),
    passport = require('passport'),
    router = express.Router(),
    auth = require('../auth/passport-auth');

// facebook
router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/login'
    }),
    function(req, res, next) {
        res.redirect('/');
        next()
    });

router.get('/facebook',
    passport.authenticate('facebook', { scope: 'email' })
);

// twitter
router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/callback',
    passport.authenticate('twitter', {
        successRedirect: '/',
        failureRedirect: '/login'
    }),
    function(req, res, next) {
        res.redirect('/');
        next()
    });

// google
router.get('/google',
    passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res, next) {
        res.redirect('/');
        next()
    });



module.exports = router