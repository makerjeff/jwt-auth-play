#JWT-auth-play

Playing with JSON Web Tokens authorization.

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
- Basic Signup Flow:
    - POST firstname, lastname, email, password
    - check to see if email exists
        - if yes, bounce back {error: 'Email already taken'}
        - if no, hash password with bcrypt before writing to database using Mongoose method, bounce back {success: true}
            - create a new account with the email as an ID (use Mongoose schema methods to verify the email is unique)
 
 - Basic Login Flow:
    - POST email, password
    - check