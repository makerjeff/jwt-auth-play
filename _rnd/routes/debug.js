/**
 * Created by jefferson.wu on 9/9/16.
 */
// DEBUG ROUTES (debug.js)

var express         = require('express');
var router          = express.Router();
var uuid            = require('node-uuid');
var jwt             = require('jsonwebtoken');
var fs              = require('fs');
var credentials     = require('../credentials');
var cookieParser    = require('cookie-parser');

router.use(cookieParser('mycookiesecret', {signed:true, httpOnly:true, maxAge: 300})); //unsigned cookied


// -- grab randomly generated uuid -- (TODO: turn into function)
router.get('/uuid', function(req,res){
    res.send(uuid.v4().toString());
});

// -- jwt with data as payload
router.get('/jwt', function(req,res){
    var token = jwt.sign({'data':'monkeypoo'}, process.env.DBPASS, {algorithm:'HS256', expiresIn: '5m'});
    res.json(token);
});

// -- fake next-page navigation --
router.get('/next', function(req,res){
    res.send('Go to the next page!');
});

// -- test signed cookie injection --
router.get('/injectcookie', function(req,res){
    res.cookie('token', jwt.sign(
        {'username':'monkeypoo', 'email':'monkeypoo@gmail.com'}, process.env.DBPASS, {algorithm: 'HS256', expiresIn: '5m'}),
        {signed:true, httpOnly:true});

    res.json({success: true, flash: 'Cookie injected.'});
    //res.redirect('/checker'); //THIS IS REQUIRED FOR AJAX COOKIE SETTING
});
// -- test signed cookie consumption --
router.get('/consumecookie', function(req,res){
    console.log(req.signedCookies.token);
    res.send('Your session token: <pre> ' + req.signedCookies.token + '</pre>');
});

// -- delete cookie token --
router.get('/deletecookie', function(req,res){
    console.log('Deleting session token');
    res.clearCookie('token');
    res.redirect('/login');
});


// ==================
// EXPORT MODULE ====
// ==================
module.exports = router;