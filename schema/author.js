const mongoose = require('mongoose');

const author = mongoose.Schema({
    name:String,
    dateCreated:Date,
    id:String,
    about:String,
    noOfStars:String,
    photo:String,
})
module.exports = mongoose.model('author', author);

