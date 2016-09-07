/**
 * Created by jeffersonwu on 9/7/16.
 */

var express     = require('express');
var jwt         = require('jsonwebtoken');
var colors      = require('colors');
var uuid        = require('node-uuid');
var fs          = require('fs');

var app         = express();
var data        = fs.readFileSync(__dirname + '/data.json');

//crank out a UUID file
//fs.writeFileSync(__dirname + '/uuid.txt', uuid.v4());

var stringData  = data.toString();
var parsedData  = JSON.parse(stringData);
var secret      = parsedData.secret;
var port        = process.env.PORT || 3000;

// ===== DEBUG DATA =====
console.log('Buffer: '.yellow);
console.log(data);
console.log('String: \n'.yellow + stringData);
console.log('JSON: \n'.yellow + parsedData);

// ==============================
// MIDDLEWARE ===================
// ==============================
app.use(function(req, res, next){
    console.log('request: ' + req.url + ' : ' + Date().yellow);
    next();
});

// ==============================
// ROUTES =======================
// ==============================
// -- base route --
app.get('/', function(req, res){
    //res.send('<h1 style="color:darkgreen; font-family: Arial, sans-serif;"> / route is working.</h1>');
    res.sendFile(__dirname + '/public/index.html');
});

// -- grab the secret phrase --
app.get('/secret', function(req,res){
    var sendObject = [
        {'buffer':data},
        {'string':stringData},
        {'json':parsedData}
    ];
    console.log('Sending object full of data.');
    res.send(secret);
});

// -- grab randomly generated uuid -- (TODO: turn into function)
app.get('/uuid', function(req,res){
    res.send(uuid.v4().toString());
});

// -- jwt with data as payload
app.get('/jwt', function(req,res){
    var token = jwt.sign(stringData, secret, {algorithm:'HS256'});
    res.json(token);
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
// FUNCTION =====================
// ==============================
function initialize(){
    app.listen(port);
    console.log('Magic happening on localhost:' + port);
}



