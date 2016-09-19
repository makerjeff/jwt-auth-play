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

checkForCredentials();  //runs credential checker

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

// -- token checker --

// API route to check for cookies, following ajax request to inject cookies.
app.get('/checker', function(req,res){

    if(req.signedCookies.token){
        //res.redirect('/main');    TODO: not needed for ajax checker
        console.log('cookie exists!');

    } else {
        console.log('Cookie does not exist, must log in, redirecting to login page.');
    }
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

                //res.json({success:true, flash:'Account added! TODO: redirect to main view!'});
                res.redirect('/main');
            }
        }

    });

});

// ======================
// LOGIN ================
// ======================
// -- GET -- returns page

app.get('/login', function(req,res){


    if(req.signedCookies.token){
        res.redirect('/main');
        console.log('cookie already exists!');

    } else {
        console.log('Cookie does not exist, must log in, redirecting to login page.');
        res.sendFile(__dirname + '/public/login.html');

    }
});

// -- POST -- verify
app.post('/login', function(req,res){
    //check to see if there's already a token

        //check to see if user exists.
        //check for token in cookie, query string, or headers
        User.findOne({email:req.body.email}, function(err, user){
            if(err){
                console.log(Error(err));
                res.json({success:false, flash:'An error has occured: ' + err});
            } else {
                //if user exists and password matches
                if(user) {

                    console.log('User ' + req.body.email + ' found. Checking password...');

                    if(bcrypt.compareSync(req.body.pwd, user.email)){

                        console.log('password is correct! setting cookie with token.');

                        var token = jwt.sign({email:userId.email}, process.env.DBPASS, {algorithm: 'HS256', expiresIn: '5m'});

                        //check to see what the token looks like
                        res.cookie('token', token, {signed:true, httpOnly:true});

                        console.log('User ' + user.email + ' logged in. ');


                        //res.redirect('/main'); //TODO: remove this once it's in the app.
                    }
                }

            }



        });



});

// =======================
// MAIN VIEW =============
// =======================
app.get('/main', routeMiddleware, function(req,res){
    res.sendFile(__dirname + '/public/main.html');
});


// =======================
// LOGOUT ================
// =======================

// dump the token cookie
// redirect to login page

app.get('/logout', function(req,res){

    res.clearCookie('token');       //dumps the token on the browser
    //res.json({success: true, flash: 'user has logged out'});
    res.redirect('/login');         //redirects to login TODO: send JSON message to front end
    console.log('A user logged out');
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

// -- check to see if credentials are passed in, if not, return error.
function checkForCredentials(){

    if(!process.env.DBPASS) {
        return console.log('No DB credentials in environmental variables. Use "DBPASS=<credentials>".'.bgRed.black);
    } else {
        //if it exists, then set the token globally.
        app.set('dbToken', process.env.DBPASS);             //set the DB encryption token (generated externally with UUID.v4)
    }



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

function setToken( res, userId, key ){
    res.cookie('token', jwt.sign(
        {email:userId.email}, process.env.DBPASS, {algorithm: 'HS256', expiresIn: '5m'}),
        {signed:true, httpOnly:true});
}

function createToken(){
    
}
