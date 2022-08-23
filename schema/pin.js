const mongoose = require('mongoose');

const pin = mongoose.Schema({
    value:String,
    used:Boolean,
    dateCreated:Date,
    usedBy:String,
    noOfTimes:Number,
    noOfTimesUsed:Number,
    id:String,
    prchsdBy:String,
    session:String,
    term:String
})
module.exports = mongoose.model('pin', pin);

