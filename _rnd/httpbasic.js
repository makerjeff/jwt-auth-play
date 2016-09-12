/**
 * Created by jefferson.wu on 9/12/16.
 */

//HTTP Basic Server

var http            = require('http');
var colors          = require('colors');
var mongodb         = require('mongodb');
var port            = 4000;

// setup
var MongoClient     = mongodb.MongoClient;
var mongoUrl        = 'mongodb://localhost/httpbasic';

var server          = http.createServer(function(req, res){
    // stuff happens here...

    res.writeHead(200, {'Content-Type':'text/html', 'X-Powered-By':'Bacon Grease'});
    res.write('<html>');
    res.write('<body>');

    res.write('<h1>This is a response without Express!</h1>');
    res.write('<p>');
    res.write('I feel naked without Express, but also liberating!');
    res.write('</p>');

    res.write('</body>');
    res.write('</html>');

    res.end();

});

server.listen(port, function(){
    console.log('Server is running on port ' + port.toString().blue + '.');
});