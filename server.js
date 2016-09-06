//server.js

// ===========================
// grab all the packages =====
// ===========================

var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var colors      = require('colors');
var hbsModule   = require('express-handlebars');

var jwt         = require('jsonwebtoken');
var config      = require('./config');
var User        = require('./app/models/user');


// ===========================
// configuration =============
// ===========================

var port = process.env.PORT || 3000;    //what port
mongoose.connect(config.database);      //connects to db defined in config.js
app.set('superSecret', config.secret);  //secret variable using setters

// setup handlebars
var handlebars = hbsModule.create({
    defaultLayout:'main'
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.disable('x-powered-by');            //hide implementation details

// use body parser to parse POST
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// ===========================
// MongoDB events ============
// ===========================

mongoose.connection.on('error', function(err){
    console.error(('connection error: ' + err).yellow); //catch the mongo connect error
});

mongoose.connection.on('connected', function(){
    console.log('Database connected.'.blue);
});

mongoose.connection.on('disconnected', function(){
    console.log('Database connection disconnected.'.red);
});


// ===========================
// routes ====================
// ===========================

// in-file debug

// app.get('/debug', function(req,res){
//     res.render('debug', {title:'This is a working title.', bodyText:'this is a working body of text!'});
// });

// basic route
app.get('/', function(req,res){
    res.send('Hello! The API is http://localhost' + port + '/api');
});

// setup
app.get('/setup', function(req,res){

    //create a sample user
    var nick = new User({
        name: 'Nick Cerminara',
        password: 'password',   //this needs to be hashed.
        admin: true
    });

    //save the sample user
    nick.save(function(err){
        if(err){
            console.log(Error(err));
        } else {
            console.log('User saved successfully.');
            res.json({success:true});
        }
    });
});

// IMPORTED ROUTES -----------
var debugRoutes = require('./routes/debug');
app.use('/debug', debugRoutes); //use these routes, but under '/debug/<route>'

// API ROUTES ----------------

//get instance of router for api routes
var apiRoutes = express.Router();

// STEP 1: route to authenticate user (POST /api/authenticate)
apiRoutes.post('/authenticate', function(req,res){
    // find the user
    User.findOne({name: req.body.name}, function(err, user){
        //if error, throw error
        if(err){
            //throw err;
            console.log(Error(err));
        }

        //if user doesn't exist...
        if(!user) {
            res.json({success: false, message:'Authentication failed. User not found.'});
            console.log('User not found.');
        } else if (user) {
            //check if password matches
            if(user.password != req.body.password){
                res.json({success: false, message: 'Authentication Failed. Wrong password.'});
                console.log('Wrong password.');
            } else {
                //if user is found and password matches,
                //CREATE A TOKEN.
                var token = jwt.sign(user, app.get('superSecret'), {
                    expiresIn:"1d"  //new for latest version
                });

                //return information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });

            }
        }
    });
});

//NOTE, using mongoose to find the user, and JWT to create the token.


// STEP 2: route middleware to verify token
apiRoutes.use(function(req,res,next){

    //check header, url, or post parameters for token...
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    //if there's a token, decode the sucka.
    if(token){

        //verifies secret and checks expiration
        jwt.verify(token, app.get('superSecret'),function(err,decoded){
            if(err){
                return res.json({success: false, message: 'Failed to authenticate token.'});
            } else {
                //if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();     //move along.
            }
        });
    } else {
        //if there is no token,
        //return an error.
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});



// ======== default routes =========

//route to show random message ( GET /api )
apiRoutes.get('/', function(req, res){
    res.json({
        message: 'Welcome to the best API on this planet!'
    });
});

// route to return all users ( GET /api/users ) (debug, add initial user)
apiRoutes.get('/users', function(req, res){
    User.find({}, function(err, users){
        if(err) {
            console.log(Error(err));
        } else {
            res.json(users);
        }
    });
});

apiRoutes.get('/data', function(req, res){
    //TODO: injectify some data to pull.
    //TODO: make it math value
});

//apply the routes to our application with prefix /api (JWXNOTE: this is cool!)
//also the default way to externalize API routes.
app.use('/api', apiRoutes);

// ====================================
// CATCH-ALL MIDDLEWARE ===============
// ====================================

// serve static files
app.use(express.static(__dirname + '/public'));

// custom 404 page middleware
app.use(function(req,res,next){
    res.status(404);
    res.json({status:404});
});

// custom 500 page middleware
app.use(function(req,res,next){
    res.status(500);
    res.json({status:500});
});


// ===========================
// start the server ==========
// ===========================

app.listen(port);
console.log('Magic happens at http://localhost:' + port);