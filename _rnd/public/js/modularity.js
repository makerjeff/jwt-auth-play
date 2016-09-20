/**
 * Created by jefferson.wu on 9/19/16.
 */
//modular.js

//template stuff TODO: move within module.
var nurseryRhymeTemplate = Handlebars.compile($('#nurseryRhymeTemplate').html());   //compile template
var $results = $('#resultsContainer');   //set results container
var $infotext = $('#infotext');

// Document 'Rapper'
$(document).ready(function(e){
    console.log(randocfun.getRandomStartupString());

    //modularity.init();

    //TEMP: TODO: remove
    $('#add_button').on('click', function(e){
        e.preventDefault();
        console.log('this is working.');
        //console.log(nurseryRhymeTemplate);

        // $results.html(nurseryRhymeTemplate({
        //     animal:'zeebra',
        //     bodyPart: 'leg',
        //     adjective: 'ran away',
        //     noun: 'a rocket'
        // }));

        $infotext.html('<h1>This is working</h1>');
    });





});






// Modularity module
var modularity = {

    users: [],

    init: function(){
        this.domCache();
        this.bindEvents();
    },

    domCache: function(){
        this.$form = $('#add_form');
        this.$input = $('#add_input');
        this.$button = $('#add_button');
        this.$ul = $('#results_UL');
    },

    getRandomQuote: function(){
        $.ajax({
            type: 'GET',
            url: 'https://52.35.91.192',
            success: function(data, status, jqXHR){},
            error: function(jqXHR, status, error){}
        });
    },

    bindEvents: function(){
        this.$button.on('click', function(e){
            e.preventDefault();
            console.log('Button has been clicked.');
        });

    },

    render: function(){

    },

    createUserButton: function(){
        var button = document.createElement('button');
        var buttonText = document.createTextNode()

    }
};
