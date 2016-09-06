/**
 * Created by jeffersonwu on 9/5/16.
 */
//loggable transaction

var mongoose = require('mongoose');
var TransactionSchema = mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    merchant: String,
    typeOfTransaction: String,
    cardUsed: String,
    costInCents: Number,
    notes: String
});
