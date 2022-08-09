const mongoose = require('mongoose');

const Stdnt = mongoose.Schema({
    dateREg:Date,
    name:String,
    id:String,
    pwd:String,
    class:String,
    subclass:String,
    contact:String,
    photo:String,
    schId:String,
    department:String,
    sex:String,
    height:String,
    weight:String,
    DoB:Date,
    bGrp:String,
    email:String
})
module.exports = mongoose.model('student', Stdnt);
