/**
 * Created by jefferson.wu on 9/12/16.
 */

var sillyLibrary = [
    'Bacon Fried Rice v0.1',
    'Turtle Turd v0.1',
    'Massively Large Monster Turd v0.1',
    'Mega City One',
    'Nuclear Engine',
    'Probability Engine',
    'Warp Drive',
    'Hyperspace Drive',
    'Monkey Turd Machine v0.1',
    'Canned-soup with meatballs'
];


exports.getEngine = function() {
    return sillyLibrary[Math.floor(Math.random() * sillyLibrary.length)];
};