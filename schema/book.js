const mongoose = require('mongoose');

const book = mongoose.Schema({
    linkPdf:String,
    linkJSON:String,
    title:String,
    dateCreated:Date,
    author:String,
    aboutAuthor:String,
    aboutBook:String,
    noOfStars:String,
    noOfReads:Number,
    bookId:String,
    bookArt:String,
    bookArtSm:String,
    price:String,
    chapters:Array(),
    genres:Array(),
    comments:Array(),
    preface:String,
    content:String,
    ack:String,

})
module.exports = mongoose.model('book', book);

