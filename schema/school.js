const mongoose = require('mongoose');

const school = mongoose.Schema({
    dateCreated: {
        type: Date,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    SchoolName:{
        type: String
    },
    activated:Boolean,
    subscribed:Boolean,
    lastSubcribed:Date,
    schoolId:String,
    subClasses:Array,
    subjects:Array,
    salt:String,
    pwd:String,
    address:String,
    schoolMotto:String,
    portal:Boolean,
    sessionPromoted:String,
    infoBrd:String,
    SchoolLogo:String,
    SchoolBanner:String,
    SchoolStamp:String,
    principalSign:String,

})
module.exports = mongoose.model('schoolw', school);
