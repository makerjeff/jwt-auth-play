/**
 * Created by jeffersonwu on 9/7/16.
 */

var express         = require('express');
var jwt             = require('jsonwebtoken');
var colors          = require('colors');
var uuid            = require('node-uuid');
var fs              = require('fs');
var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');
var mongoose        = require('mongoose');
var bcrypt          = require('bcrypt-nodejs');

var app             = express();
var port            = process.env.PORT || 3000;


// ==============================
// SETUP ========================
// ==============================

var User            = require('./models/users');    //user schema
var sillyText       = require('./models/silly');    //sillyEngines
var startupMessages = require('./models/startup_messages');     //silly startup messages

// MONGODB ======================
mongoose.connect('mongodb://localhost/jwt_users');

mongoose.connection.on('error', function(err){
    console.error(('connection error: ' + err).yellow); //catch the mongo connect error
});

mongoose.connection.on('connected', function(){
    console.log('Database connected.'.blue);
});

mongoose.connection.on('disconnected', function(){
    console.log('Database connection disconnected.'.red);
});




// ==============================
// MIDDLEWARE ===================
// ==============================



// -- body parser --
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// -- cookie parser --
app.use(cookieParser('mycookiesecret', {signed:true, httpOnly:true, maxAge: 300})); //signed


// -- disable stuff --
//app.disable('x-powered-by');
app.use(function(req,res,next){
    res.setHeader('X-Powered-By', sillyText.getEngine());
    next();
});

// -- jeff logger --
app.use(function(req, res, next){
    if(req.method == 'GET'){
        console.log('Method: '.blue + req.method.green + ', URL: '.blue + req.url.green + ' ::: ' + Date().yellow);
    }
    else if(req.method == 'POST') {
        console.log('Method: '.blue + req.method.green + ', URL: '.blue + req.url.green + ', User: '.blue + colors.green(req.body.email) + ' ::: ' + Date().yellow);
    } else {
        console.log('unrecognized request type'.red);
    }

    next();
});


// ==============================
// ROUTES =======================
// ==============================

// == External routes ===========
var debugRoutes = require('./routes/debug');
app.use('/debugging', debugRoutes);


// -- base route --
app.get('/', function(req, res){
    //res.send('<h1 style="color:darkgreen; font-family: Arial, sans-serif;"> / route is working.</h1>');
    res.sendFile(__dirname + '/public/index.html');
});

// ======================
// SIGNUP ===============
// ======================
// -- GET -- load the page
app.get('/signup', function(req,res){
    //TODO: if token exists, redirect to data-page (or alert front end)
    res.sendFile(__dirname + '/public/signup.html');

});
// -- POST -- create user (if user doesn't exist);
app.post('/signup', function(req,res){
    //check to see if user exists, if it does, return data object with success: false
    User.findOne({email:req.body.email}, function(err, user){
        if(err){
            //database error
            console.log(Error(err));
            res.json({success:false, flash: 'Error with fetching data!'});
        } else {
            if(user){
                //if user exists
                console.log('User already exists.'.red);
                res.json({success: false, flash: 'User already existssss.'});
            } else {
                // add new user block
                new User({
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.pwd)
                }).save();
                // add new user block -- END

                console.log('New user added.'.green);
                res.json({success:true, flash:'Account added! TODO: redirect to main view!'});
            }
        }

    });

});

// ======================
// LOGIN ================
// ======================
// -- GET -- returns page

app.get('/login', function(req,res){
    res.sendFile(__dirname + '/public/login.html');
});

// -- POST -- verify
app.post('/login', function(req,res){
    //check to see if user exists.

});

// =======================
// LOGOUT ================
// =======================

// dump the token cookie
// redirect to login page

app.get('/logout', function(req,res){

    res.clearCookie('token');       //dumps the token on the browser
    res.redirect('/login');         //redirects to login TODO: send JSON message to front end
});


// =======================
// TEST ROUTES ===========
// =======================
// -- DB TESTER ROUTER --
app.get('/db-tester', routeMiddleware, function(req,res){
    //grab user's cookies and display them
    //res.json(req.cookies);
    console.log('token: ' + req.signedCookies.token);

    var dummyData = {'username':'jimbop@gmail.com', 'data': [
        {'name':'note1', 'data':'I am wonderful. How is that for a note?'},
        {'name':'note2', 'data':'I am also pretty awesome.'},
        {'name':'note3', 'data':'That\'s the last time I leave my window open for intruders.'},
        {'name':'note4', 'data':'Without protecting this route, it\'s equivalent to bending over and spreading my cheeks.'}
    ]};

    res.json(dummyData);
});

app.post('/db-tester', function(req,res){

});








// ==============================
// CATCH-ALLS ===================
// ==============================
// serve static files
app.use(express.static(__dirname + '/public'));

// custom 404 page middleware
app.use(function(req,res,next){
    res.status(404);
    res.send('404');
});

// custom 500 page middleware
app.use(function(req,res,next){
    res.status(500);
    res.send('500');
});

// ==============================
// START APP ====================
// ==============================
initialize();

// ==============================
// FUNCTIONS ====================
// ==============================
function initialize(){
    app.listen(port);
    console.log(startupMessages.getRandomMessage() + ' on localhost:' + port);
}

// -- DB tester-ware --
function routeMiddleware(req, res, next){
// functions as a gateway. If token doesn't exist, thou shall not pass.
    //
    if(!req.signedCookies.token) {
        console.log('no cookie present.');
        return res.json({message: 'You\'re a lying cheating bastard. You didn\'t come with authorized cookies. '});
    } else {
        return next();
    }
}


// ---- official isAuthenticated route ----
// use this for API calls that require authentication.
function isAuthenticated(req,res,next) {
    //... check req.cookies for token
    //... check DB for user in that token
    //... check
}
