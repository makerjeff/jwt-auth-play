//server.js

// ===========================
// grab all the packages =====
// ===========================

var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt         = require('jsonwebtoken');
var config      = require('./config');
var User        = require('./app/models/user');


// ===========================
// configuration =============
// ===========================

var port = process.env.PORT || 3000;    //what port
mongoose.connect(config.database);      //connects to db defined in config.js
app.set('superSecret', config.secret);  //secret variable using setters

// use body parser to parse POST
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));


// ===========================
// routes ====================
// ===========================

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

// API ROUTES ----------------

//get instance of router for api routes
var apiRoutes = express.Router();

// Step 1: route to authenticate user (POST /api/authenticate)
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
        } else if (user) {
            //check if password matches
            if(user.password != req.body.password){
                res.json({success: false, message: 'Authentication Failed. Wrong password.'});
            }
        } else {
            //if user is found and password matches,
            //CREATE A TOKEN.
            var token = jwt.sign(user, app.get('superSecret'), {
                expiresInMinutes:1440   //expires in 24 hours.
            });

            //return information including token as JSON
            res.json({
                success: true,
                message: 'Enjoy your token!',
                token: token
            });
        }
    });
});

//NOTE, using mongoose to find the user, and JWT to create the token.



// TODO: route middleware to verify token

//route to show random message ( GET /api )
apiRoutes.get('/', function(req, res){
    res.json({
        message: 'Welcome to the best API on this planet!'
    });
});

// route to return all users ( GET /api/users )
apiRoutes.get('/users', function(req, res){
    User.find({}, function(err, users){
        if(err) {
            console.log(Error(err));
        } else {
            res.json(users);
        }
    });
});

//apply the routes to our application with prefix /api (JWXNOTE: this is cool!)
app.use('/api', apiRoutes);




// ===========================
// start the server ==========
// ===========================

app.listen(port);
console.log('Magic happens at http://localhost:' + port);