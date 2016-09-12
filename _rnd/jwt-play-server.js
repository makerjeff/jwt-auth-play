/**
 * Created by jeffersonwu on 9/7/16.
 */

var express     = require('express');
var jwt         = require('jsonwebtoken');
var colors      = require('colors');
var uuid        = require('node-uuid');
var fs          = require('fs');
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');

var app         = express();
var port        = process.env.PORT || 3000;





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
// -- base route --
app.get('/', function(req, res){
    //res.send('<h1 style="color:darkgreen; font-family: Arial, sans-serif;"> / route is working.</h1>');
    res.sendFile(__dirname + '/public/index.html');
});

// == External routes ===========
var debugRoutes = require('./routes/debug');
app.use('/debugging', debugRoutes);


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



