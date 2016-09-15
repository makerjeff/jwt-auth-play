/**
 * Created by jefferson.wu on 9/15/16.
 */

//silly server startup messages that won't get seen once we go into production mode with PM2.

var server = 'localhost';
var startupMessages = [
    'Magic happening',
    'Engines revving',
    'Monkeys dancing',
    'Maximum power',
    'Drinks served',
    'Firing up the hyperspace drive',
    'Firing up the warp drive',
    'Engaging adult activities',
    'Generating steam power',
    'Making breakfast'
];

exports.getRandomMessage = function() {
    return startupMessages[Math.floor(Math.random() * startupMessages.length)];
};
