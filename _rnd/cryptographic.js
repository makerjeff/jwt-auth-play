//cryptographics.js
//experimenting with cryptography.TODO: practice encrypting EVERYTHING.

var crypto      = require('crypto');
var prompt      = require('prompt');
var colors      = require('colors');
var bcrypt      = require('bcrypt-nodejs');
var mongoose    = require('mongoose');

var algorithm   = 'aes-256-ctr';
var password    = 'monkeypoo';

var mode        = process.argv[2];

/**
 * Encrypt using Node.js crypto module.
 * @param textString Input text string.
 * @returns {*} Returns encrypted string.
 */
function encrypt(textString) {
    var cipher = crypto.createCipher(algorithm, password);
    var crypted = cipher.update(textString, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

/**
 * Decrypt using Node.js crypto module.
 * @param textString    Text string to decrypt.
 * @returns {*}         Returns decrypted text string.
 */
function decrypt(textString) {
    var decipher = crypto.createDecipher(algorithm, password);
    var dec = decipher.update(textString, 'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
}

/**
 * Use Bcrypt to hash passwords.
 * @param textString    Input data to hash.
 * @returns {*}         Returns Bcrypt-ed hash (to store in db).
 */
function bcryptHash(textString){
    return bcrypt.hash(textString,null,null,function(err,hash){
        return hash;
    });
}

function bcryptHashSync(textString){
    return bcrypt.hashSync(textString);
}

//enable Prompt.
prompt.start();

// prompt.get(['username','email'], function(err,result){
//     console.log('Command-line input received: ');
//     console.log('username: '.yellow + result.username);
//     console.log('email: '.yellow + result.email);
// });

if(mode == 'ENCRYPT'){
    //advanced Prompt options in object array
    prompt.get([
        {
            name: 'username',
            description: 'Please enter your username: ',
            type: 'string',
            required: true
        },{
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
        console.log('username: '.cyan + encrypt(result.username));
        console.log('email: '.cyan + encrypt(result.email));
        console.log('password: '.cyan + bcryptHashSync(result.password));
    });

}

else if(mode == 'DECRYPT') {
    prompt.get([
        {name: 'hashies', description: 'Enter a hash: ', type: 'string'},
        {name: 'password', description: 'Enter your password: ', type: 'string', hidden: true}
    ], function(err, result){
        if(result.password === password) {
            console.log('Your result: ' + decrypt(result.hashies));
        } else {
            console.log('Password is incorrect.'.red);
        }
    });
}


