/**
 * Created by jefferson.wu on 9/6/16.
 */
//debug routes

var express = require('express');
var router = express.Router();

// ====== DEBUG ROUTES ======
router.get('/route1', function(req,res){
    res.render('debug', {title: 'Route-1', bodyText:'Debug route-1 is working!'});
});
router.get('/route2', function(req,res){
    res.render('debug', {title: 'Route-2', bodyText:'Debug route-2 is working!'});
});
router.get('/route/:num', function(req,res){
    res.render('debug', {title: 'Route-' + req.params.num, bodyText:'Debug route-' + req.params.num + ' is working!'});
});
// ====== EXPORT TO WORLD ======
module.exports = router;