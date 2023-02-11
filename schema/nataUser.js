const mongoose = require('mongoose');

const Stdnt = mongoose.Schema({
    dateREg:Date,
    name:String,
    id:String,
    pwd:String,
    contact:String,
    income:Number,
    bizMoney:Number,
    address:String,
    salt:String,
    email:String
})
module.exports = mongoose.model('nataUser', Stdnt);
