'use strict'

var express = require("express");
var app = express();

var cors = require("cors");
app.use(cors({origin: ['https://reportkad.netlify.app','https://marvellous-idoko.github.io/EduRepo',
'https://marvellous-idoko.github.io/tutoAdmin',
'http://localhost:4200','http://localhost:8080']}));
// app.use(cors({origin: 'http://localhost:4200'}));

var mongoose = require("mongoose");
const master = require('./master')
const school = require('./school')

// app.use(cors());
// app.options('*', cors())


app.use(express.json());
app.use(express.urlencoded({extended: true}));
let URL = 'mongodb+srv://CaptJackSparrow:GcLNtd0BR6xiW11b@educatcluster0.xr1hmp5.mongodb.net/?retryWrites=true&w=majority'

// mongoose.connect('mongodb://localhost:27017/',{useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connect(URL,{useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('connected', ()=>{
    console.log("connected to DB");
});
// GcLNtd0BR6xiW11b
mongoose.connection.on('error',(err)=>{
    if(err)console.log("error in DB connection"+err);
    console.log("connected")
})


// app.use('/school', school)
// app.use('/master', master)
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
