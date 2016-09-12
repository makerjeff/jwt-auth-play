/**
 * Created by jefferson.wu on 9/12/16.
 */

//HTTP Basic Server

var http = require('http');

var server = http.createServer(function(req, res){
    // stuff happens here...

    res.writeHead(200, {'Content-Type':'application/json', 'X-Powered-By':'Bacon Grease'});
    res.write('<html>');
    res.write('<body>');

    res.write('<h1>This is a response without Express!</h1>');
    res.write('<p>');
    res.write('I feel naked without ')
    res.write('</p>');

    res.write('</body>');
    res.write('</html>');

    res.end();

});