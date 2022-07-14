'use strict'

var express = require("express");
var app = express();

var cors = require("cors");
var mongoose = require("mongoose");
const master = require('./master')
const school = require('./school')


app.use(cors());
app.options('*', cors())

app.use(express.json());
app.use(express.urlencoded({extended: true}));
mongoose.connect('mongodb://localhost:27017/',{useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('connected', ()=>{
    console.log("connected to DB");
});
mongoose.connection.on('error',(err)=>{
    if(err)console.log("error in DB connection"+err);
    console.log("connected")
})


app.use('/school', school)
app.use('/master', master)
app.use('/', master)
// app.use('/', school)

app.get('/', function(req, res) {
    res.send('Hello from root route.')
  });

// require("./router")(app);

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
console.log("starting... server at "+port);
});
