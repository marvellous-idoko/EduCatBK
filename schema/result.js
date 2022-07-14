const mongoose = require('mongoose');
const result = mongoose.Schema({
    term:String,
    subject:String,
    stId:String,
    testScr:Number,
    ExamScr:Number,
    total:Number,
    Grade:String,
    lastUpdated:Date,
    lastUpdatedBy: String,
    schId:String,
    published:Boolean,
    class:String,
    session:String,
    subclass:String,
    name:String
})
module.exports = mongoose.model('result', result);

