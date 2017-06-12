const express = require('express'),
    router = express.Router()

router.get('/', loggedIn, (req, res) => {
    console.log(req.user)
    res.render('home', {
        user: req.user
    })
})

router.get('/users/login', (req, res) => {

    res.render('login')
})

router.get('/users/profile', loggedIn, (req, res) => {
    console.log(req.user)
    res.render('profile', {
        user: req.user
    })
})

function loggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'You are not logged in')
        res.redirect('/users/login')
        console.log(req.flash('error_msg', 'You are not logged in'))
    }

}

router.use('/users', require('./social-user'))
    //logout
router.get('/users/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});




module.exports = router