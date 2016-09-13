/**
 * Created by jefferson.wu on 9/13/16.
 */
//random 'car engine' X-Powered-By

var carEngines = [
    '1ZZ-FE 1.8L',
    'SR20DET 2.0L Turbo',
    'EJ25 2.5L Turbo',
];

exports.getEngine = function(){
    return carEngines[Math.floor(Math.random() * carEngines.length)];
};