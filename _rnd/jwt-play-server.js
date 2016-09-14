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

var app             = express();
var port            = process.env.PORT || 3000;


// ==============================
// SETUP ========================
// ==============================

var User            = require('./models/users');    //user schema
var sillyText       = require('./models/silly');    //sillyEngines schema
var data            = fs.readFileSync(__dirname + '/data.json');




// ==============================
// MIDDLEWARE ===================
// ==============================

// -- jeff logger --
app.use(function(req, res, next){
    console.log('request: ' + req.url + ' : ' + Date().yellow);
    next();
});

// -- body parser --
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// -- cookie parser --
app.use(cookieParser());

// -- disable stuff --
//app.disable('x-powered-by');
app.use(function(req,res,next){
    res.setHeader('X-Powered-By', sillyText.getEngine());
    next();
});


// ==============================
// ROUTES =======================
// ==============================

// == External routes ===========
var debugRoutes = require('./routes/debug');
app.use('/debugging', debugRoutes);


// -- grab the secret phrase --
app.get('/secret', function(req,res){
    var sendObject = [
        {'buffer':debugRoutes.data},
        {'string':debugRoutes.stringData},
        {'json':debugRoutes.parsedData},
        {'secret':debugRoutes.secret}
    ];
    console.log('Sending object full of data.');
    res.json(JSON.parse(data));
});
// -- base route --
app.get('/', function(req, res){
    //res.send('<h1 style="color:darkgreen; font-family: Arial, sans-serif;"> / route is working.</h1>');
    res.sendFile(__dirname + '/public/index.html');
});

// -- login GET route --

app.get('/login', function(req,res){
    res.sendFile(__dirname + '/public/login.html');
});

// -- login POST route --
app.post('/login', function(req,res){
    //check to see if user exists.

});

// -- DB TESTER ROUTER --
app.get('/db-tester', function(req,res){
    //grab user's cookies and display them
    //res.json(req.cookies);
    console.log('data sent: ' + req.cookies.data);

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
    console.log('Magic happening on localhost:' + port);
}



