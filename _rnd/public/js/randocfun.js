/**
 * Created by jefferson.wu on 9/19/16.
 */

//randocfun.js
//Front end library that generates fun random 'document is ready' messages.

var randocfun = {

    startupLibrary: [
        'Document is ready.',
        'Duck soup is ready.',
        'Rocket ready for launch',
        'Monkeys ready to turn gears.',
        'Cogs ready to turn.',
        'Band ready to rock',
        'Candy ready to decay teeth.',
        'Poprocks ready to explode stomachs.',
        'Guns ready to misfire.',
        'Lemons ready to scream while being turned into lemonade.'
    ],

    /**
     * Get a random string for 'Document is Ready' note.
     * @returns {*}
     */
    getRandomStartupString: function(){
        return this.startupLibrary[Math.floor(Math.random() * this.startupLibrary.length)];
    }
};