'use strict'

var express = require("express");
var app = express();

var cors = require("cors");
var mongoose = require("mongoose");
const master = require('./master')
const school = require('./school')


app.use(cors({origin: 'https://educat-ng.netlify.app'}));
app.use(cors({origin: 'https://marvellous-idoko.github.io/EduRepo'}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
let URL = 'mongodb+srv://CaptJackSparrow:GcLNtd0BR6xiW11b@educatcluster0.xr1hmp5.mongodb.net/?retryWrites=true&w=majority'
// mongoose.connect('mongodb://localhost:27017/',{useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connect(URL,{useNewUrlParser: true, useUnifiedTopology: true })
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
