const mongoose = require('mongoose');
const result = mongoose.Schema({
    term:String,
    subject:String,
    stId:String,
    testScr1:Number,
    testScr2:Number,
    testScr3:Number,
    testScr4:Number,
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
    name:String,
    avg:Number
})
module.exports = mongoose.model('result', result);

