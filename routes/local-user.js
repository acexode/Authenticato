const express = require('express'),
    passport = require('passport'),
    router = express.Router(),
    pass = require('../auth/local-passport');

// model

const User = require('../model/local');

// Post login
router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    }),
    (req, res, next) => {
        res.redirect('/profile');
        next()
    });

router.post('/register', (req, res) => {

    // validation
    req.checkBody('email', 'email is required').notEmpty()
    req.checkBody('email', 'Invalid email').isEmail
    req.checkBody('username', 'username is required').notEmpty()
    req.checkBody('password', 'password is required').notEmpty()
    const error = req.validationErrors()
    if (error) {
        res.render('login', {
            errors: error
        })
    } else {
        User.findOne({ 'username': req.body.username }, (err, user, done) => {
            if (err) throw err;
            if (user) {
                err_msg = [{ 'msg': 'Username already exist' }];
                res.render('login', {
                    errors: err_msg
                })
            } else {
                const newUser = new User()
                newUser.email = req.body.email
                newUser.username = req.body.username
                newUser.password = req.body.password
                User.createUser(newUser, (err, user) => {
                    if (err) throw err;
                    console.log(user)
                })

                success = [{ 'msg': 'You are registered!, click the login tab to login' }];
                res.render('login', {
                    success_msg: success
                })
            }
        })
    }
})

module.exports = router