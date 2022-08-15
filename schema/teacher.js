const mongoose = require('mongoose');

const teacher = mongoose.Schema({
    name:String,
    class:String,
    subject:Array,
    email:String,
    teacherID:String,
    dateOfEnrolMent:Date,
    subClass:Array,
    pwd:String,
    schId:String,
    salt:String,
})
module.exports = mongoose.model('teacher', teacher);
