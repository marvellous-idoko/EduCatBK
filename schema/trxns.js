const mongoose = require('mongoose');
const crypto = require("crypto");

const trx = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    amount:
    {
        type: String,
        required: true
    },
    coins: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }

})
const trxHist = module.exports = mongoose.model('trxHist', trx);
