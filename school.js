'use strict'
var express = require("express");
const sch = express.Router();
const school = require('./schema/school')
const pre = '/school/';


sch.get('/school',(req,res)=>{
    console.log('connected')
})

sch.post(pre+'CreateTeacher/',(req,res)=>{
    var id = Math.floor(Math.random() * 1000000)
    var sch = new school()
    sch.dateCreated = new Date();
    sch.email = req.body.email
    sch.id = id;
    try{
    sch.save((e,r)=>{
        if(e)throw Error('unable to create user: '+ e)
        else{
            console.info(r)
        }
    })

    }catch(e){
        console.info(e)
    }
})
module.exports = sch;