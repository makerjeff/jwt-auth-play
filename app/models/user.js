// app/models/user.js

// grab mongoose
var mongoose = require('mongoose');
var UserSchema = mongoose.Schema({
    name: String,
    password: String,
    admin: Boolean
});

// mongoose methods here (bcrypt, etc)

// export model
module.exports = mongoose.model('User', UserSchema);