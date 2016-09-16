/**
 * Created by jeffersonwu on 9/11/16.
 */

//users.js (mongoose)

    //-- grab mongoose --
var mongoose = require('mongoose');

//-- define schema --
var userSchema = mongoose.Schema({
    email: String,
    password: String
});

// -- schema methods -- IF ANY


// -- create model --
var User = mongoose.model('User', userSchema);

// -- export module --
module.exports = User;