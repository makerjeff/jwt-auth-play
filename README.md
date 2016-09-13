#JWT-auth-play

Playing with JSON Web Tokens authorization.

## Notes
- Adding a bare bones login system to "_rnd".

## Dependencies
- JQuery
- Bootstrap
- Handlebars

## Reference
- [Scotch.io Authenticate NODE.JS API with JSON Web Tokens.](https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens)
- [npm node-uuid: Simple, fast generation of RFC4122 UUIDs](https://www.npmjs.com/package/node-uuid): Consider using this to create random keys.
- [Ultimate Guide to Node Logging Basics](https://www.loggly.com/ultimate-guide/node-logging-basics/)
- [Mongoose Connection Best Practice](http://theholmesoffice.com/mongoose-connection-best-practice/)
- [Node.JS encryption and decryption](http://lollyrock.com/articles/nodejs-encryption/)
- [npm prompt](https://www.npmjs.com/package/prompt): Prompting made easy.
- [MongoDB client](http://blog.modulus.io/mongodb-tutorial): For use without Express.

## NOTES
- **Basic Signup Flow**:
    - POST firstname, lastname, email, password
    - check to see if email exists
        - if yes, bounce back {error: 'Email already taken'}
        - if no, hash password with bcrypt before writing to database using Mongoose method, bounce back {success: true}
            - create a new account with the email as an ID (use Mongoose schema methods to verify the email is unique)
 
 - **Basic Login Flow**:
    - POST to /authenticate route (client-AJAX)
    - check DB for user (server-mongoose)
        - if error, respond with json object {success: false, message: '<error message>'}
        - else if user exists:
            - check password (server-bcrypt)
                - if password doesn't match, respond with json object {success: false, message: '<error message>'}
                - if password matches,
                    - create token with: user object, secret, {expiresIn:"1h"} (options object)
                    - respond with json object {success: true, message: '<congrats message>', token: <token>};
    - Store token in local storage or cookie header
    - create middleware to protect specific routes (server):
        - create token polyfill (header, url param, or post param);
        - if token exists,
            - check token with jwt.verify(token, secret, callback(err,decoded){});
                - if error, return json object {success: false, message: 'Failed to authenticate.'};
                - else, set req.decoded = decoded. (to be used for subsequent requests)
                - store token on client (localStorage or cookie);
                - run the 'next()' method.

        - if no token, send status 403, send object {success: false, message: 'token failure message'}

 - **Basic Logout Flow**:
    - remove token from client.
