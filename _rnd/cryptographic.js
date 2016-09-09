//cryptographics.js
//experimenting with cryptography.TODO: practice encrypting EVERYTHING.

var crypto      = require('crypto');
var prompt      = require('prompt');
var colors      = require('colors');

var algorithm   = 'aes-256-ctr';
var password    = 'monkeypoo';

function encrypt(textString) {
    var cipher = crypto.createCipher(algorithm, password);
    var crypted = cipher.update(textString, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(textString) {
    var decipher = crypto.createDecipher(algorithm, password);
    var dec = decipher.update(textString, 'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
}

//
// var hw = encrypt('helloworld!');
// console.log(hw);
// console.log(decrypt(hw));


prompt.start();

// prompt.get(['username','email'], function(err,result){
//     console.log('Command-line input received: ');
//     console.log('username: '.yellow + result.username);
//     console.log('email: '.yellow + result.email);
// });

prompt.get([
    {
        name: 'username',
        description: 'Please enter your username: ',
        type: 'string',
        required: true
    },
    {
        name: 'email',
        description: 'Please enter your email address: ',
        type: 'string',
        required: true,
        message: 'this is a messages!'
    },{
        name: 'password',
        description: 'Please enter a password: ',
        type: 'string',
        required: true,
        hidden: true
    }
], function(err, result){
    console.log('Command line date received: ');
    console.log('username: '.cyan + result.username);
    console.log('email: '.cyan + result.email);
    console.log('password: '.cyan + result.password);

});
