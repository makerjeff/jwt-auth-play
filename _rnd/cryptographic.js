//cryptographics.js
//experimenting with cryptography.TODO: practice encrypting EVERYTHING.

// == MODULES ==
var crypto              = require('crypto');
var prompt              = require('prompt');
var colors              = require('colors');
var bcrypt              = require('bcrypt-nodejs');
var mongodb             = require('mongodb');

// == DATABASE ==
var MongoClient         = mongodb.MongoClient;
var url                 = 'mongodb://localhost/cryptographic';


// == CRYPTO ==
var algorithm           = 'aes-256-ctr';
var defaultPassword     = 'monkeypoodle';

//application flow
var mode                = process.argv[2];

/**
 * Encrypt using Node.js crypto module.
 * @param textString Input text string.
 * @param passwd Password you want to use to encrypt.
 * @returns {*} Returns encrypted string.
 */
function encrypt(textString, passwd) {
    var cipher = crypto.createCipher(algorithm, passwd);
    var crypted = cipher.update(textString, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

/**
 * Decrypt using Node.js crypto module.
 * @param textString    Text string to decrypt.
 * @param passwd        Password used during encryption.
 * @returns {*}         Returns decrypted text string.
 */
function decrypt(textString, passwd) {
    var decipher = crypto.createDecipher(algorithm, passwd);
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

/**
 * Use Bcrypt to hash passwords (synchronously).
 * @param textString    Input data to hash.
 * @returns {*}         Returns Bcrypt-ed hash (to store in db).
 */
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
        console.log('username: '.cyan + encrypt(result.username, result.password));
        console.log('email: '.cyan + encrypt(result.email, result.password));
        console.log('password: '.cyan + bcryptHashSync(result.password));
    });

}

else if(mode == 'DECRYPT') {
    prompt.get([
        {name: 'hashies', description: 'Enter a hash: ', type: 'string'},
        {name: 'password', description: 'Enter your password: ', type: 'string', hidden: true}
    ], function(err, result){
        //TODO: check database for password

        return console.log(decrypt(result.hashies, result.password));
    });
}

else if(mode == 'STORE') {


    prompt.get([
        {name: 'username', description: 'Enter a username: ', type: 'string', required: true},
        {name: 'email', description: 'Enter your email: ', type: 'string', required: true},
        {name: 'password', description: 'Enter a password: ', type: 'string', hidden:true, required: true}
    ], function(err, result){

        //connect to db
        MongoClient.connect(url, function(err, db){
            if(err){
                console.log('Unable to connect to the database. Error: ' + err);
            } else {
                console.log('Connection to ' + url.green + ' established.');

                //store to db, then close DB.
                var collection = db.collection('users');
                var user = {
                    username: encrypt(result.username, defaultPassword),    //TODO: switch to result.passwd
                    email: encrypt(result.email, defaultPassword),          //TODO: switch to result.passwd
                    password: bcryptHashSync(result.password)
                };

                collection.insert(user, function(err, result){
                    if(err){
                        console.log(err);
                    } else {
                        console.log('Inserted ' + user + ' into database.' );
                    }
                });

                db.close();
            }
        });

    });

}


