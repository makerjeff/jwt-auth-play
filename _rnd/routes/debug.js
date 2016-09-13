/**
 * Created by jefferson.wu on 9/9/16.
 */
// DEBUG ROUTES (debug.js)

var express     = require('express');
var router      = express.Router();
var uuid        = require('node-uuid');
var jwt         = require('jsonwebtoken');

var fs          = require('fs');
var data        = fs.readFileSync(__dirname + '/../data.json');

//crank out a UUID file
//fs.writeFileSync(__dirname + '/uuid.txt', uuid.v4());

// LEGACY, but good for reference.
var stringData  = data.toString();
var parsedData  = JSON.parse(stringData);
var secret      = parsedData.secret;
//
// // ===== DEBUG DATA =====
// console.log('Buffer: '.yellow);
// console.log(data);
// console.log('String: \n'.yellow + stringData);
// console.log('JSON: \n'.yellow + parsedData);


// -- grab randomly generated uuid -- (TODO: turn into function)
router.get('/uuid', function(req,res){
    res.send(uuid.v4().toString());
});

// -- jwt with data as payload
router.get('/jwt', function(req,res){
    var token = jwt.sign(stringData, secret, {algorithm:'HS256'});
    res.json(token);
});

router.get('/next', function(req,res){
    res.send('Go to the next page!');
});


module.exports          = router;
exports.data            = data;
exports.stringData      = stringData;
exports.parsedData      = parsedData;
exports.secret          = secret;