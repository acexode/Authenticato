const express = require('express'),
    path = require('path'),
    exphbs = require('express-handlebars'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    mongodb = require('mongodb'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    flash = require('connect-flash'),
    expv = require('express-validator'),
    app = express()

//connect db
mongoose.connect('mongodb://localhost/facebook')
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("connected to db");
});


// view engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')))

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'foo bar',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(expv({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// connect flash
app.use(flash())
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.errors = req.flash('errors');
    res.locals.user = req.user || null;
    next()
});
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next()
});

// route files


index = require('./routes/index')
const twin = app
    // path
app.use('/', index)
    //app.use('/users', require('./routes/social-user'))

app.use('/users', require('./routes/local-user'))




const port = 3000
app.listen(port, () => {
    console.log('listening on port ' + port)
})