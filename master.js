'use strict'

var express = require("express");
const mstr = express.Router();
const school = require('./schema/school')
const teacher = require('./schema/teacher')
const pre = '/mstr/';
const schAdmin = '/schAdmin/';
const auth = '/auth/';
const teacherApi = '/teacher/';
const rslt = '/result/';
const pin = require('./pin');
const Auth = require('./auth');
const Student = require("./schema/student");
const result = require('./results')
const fileUpload = require("express-fileupload");
const { request } = require("http");

mstr.use(fileUpload({ debug: true }))
mstr.use(express.json());
mstr.use(express.urlencoded({ extended: true }));
mstr.get('/', (req, res) => {
    console.log('connec000ted')
})
// master

mstr.post(pre + 'CreateSchool/', (req, res) => {
    var id = Math.floor(Math.random() * 1000000)
    console.info(id)
    var sch = new school()
    sch.dateCreated = new Date();
    sch.email = req.body.email
    sch.schoolId = id;
    sch.portal = false
    sch.subClasses = ['JSS1A', 'JSS2A', 'JSS3A', 'SSS1A', 'SSS2A', 'SSS3A']
    try {
        sch.save((e, r) => {
            if (e) throw new Error('unable to create user: ' + e)
            else {
                res.json({ code: 1, msg: 'success' })
            }
        })
    } catch (e) {
        console.info(e)
    }
})
mstr.get(pre+'checkSchId/:id', async(req,res)=>{
    // console.su('')
    let r = await school.findOne({schoolId:req.params.id})
    if(r == null ){
        res.json({code:0,msg:'school not found, check your ID and try again'})
    }else{
        res.json({code:1,msg:r})
    }
}).get(pre+'checkStdntId/:id', async(req,res)=>{
    // console.su('')
    let r = await Student.findOne({schoolId:req.params.id})
    if(r == null ){
        res.json({code:0,msg:'student record not found, check your ID and try again'})
    }else{
        res.json({code:1,msg:r})
    }
})


// School Admin section
mstr.post(schAdmin + "addTeacher", (req, res) => {
    var nTeacher = new teacher()
    nTeacher.teacherID = 'TCHR' + Math.floor(Math.random() * 1000000)
    nTeacher.subject = req.body.subjects
    nTeacher.class = req.body.personaleDet.class
    nTeacher.subClass = req.body.subClass
    nTeacher.schId = req.body.schId
    nTeacher.name = req.body.personaleDet.name
    nTeacher.dateOfEnrolMent = new Date()
    nTeacher.pwd = '123456'
    try {
        nTeacher.save((e, r) => {
            if (e) throw new Error('database error . .  ' + e)
            else {
                res.json({ code: 1, msg: 'successfully added teacher, your id is: '
                +r['teacherID']+"\n"+"Your default password is: 123456, you can change it on your portal" })
            }
        })
    } catch (e) {
        res.json({ code: 0, msg: e })
    }
}).post(schAdmin + "addSubclass", async (req, res) => {
    let schoolf = await school.findOne({ schoolId: req.body.id })
    console.log(req.body)
    // var arr = new Array(schoolf.subClasses)
    // var result = schoolf.subClasses.includes(req.body.subClass)
    if (schoolf.subClasses.includes(req.body.subClass) === true) {
        res.json({ code: 0, msg: "class already exists" })
        return;
    }
    else {
        // arr.push(req.body.subClass)
        schoolf.subClasses.push(req.body.subClass)
        try {
            schoolf.save((e, r) => {
                if (e) throw new Error('database error . .  ' + e)
                else {
                    console.log(r)
                    res.json({ code: 1, msg: 'successfully added subclass' })
                }
            })
        } catch (e) {
            res.json({ code: 0, msg: e })
        }
    }

}).post(schAdmin + 'actAcct', async (req, res) => {
    // if( await pin.checkPinUsage(req.body.ActivationPin) == true){
    //     res.json({code:0,msg:'Pin is incorrect or already used'})
    // }else{
    console.log(req.body)
    var acct = await school.findOne({ schoolId: req.body.id })
    acct.SchoolName = req.body.sName
    acct.pwd = req.body.pwd
    acct.schoolMotto = req.body.sMotto
    acct.address = req.body.address
    acct.activated = true
    acct.subscribed = true
    acct.lastSubcribed = new Date()
    acct.save((e, r) => {
        if (e) throw new Error('database error . .  ' + e)
        else {
            r.pwd = ''
            res.json({ code: 1, msg: 'successfully activated account', info: r })
        }
    })
    // }


}).post(schAdmin + "addSubject", async (req, res) => {
    var fr = await school.findOne({ schoolId: req.body.id })
    if (fr.subjects.includes(req.body.Subjt) === true) {
        res.json({ code: 0, msg: "subject already exists" })
        return;
    } else {
        fr.subjects.push(req.body.Subjt)
        fr.save((e, r) => {
            if (e) throw new Error('database error . .  ' + e)
            else {
                res.json({ code: 1, msg: 'successfully added subject' })
            }
        })
    }
}).post(schAdmin+'addStudent',async (req,res)=>{
    console.info(req.body.id)
    var sch = await school.findOne({schoolId:req.body.id})
    if (sch == null){
        return res.json({code:0,msg:'error  . . .'})
    }else{
    let jui = JSON.parse(req.body.formInfo)
    var up = __dirname + '/images/' + 'educat_'+Math.floor(Math.random() * 10000000000) + '.png';
    // console.log(req.files +'  kol')
    req.files.photo.mv(up,(err)=>{
        
        let newStdnt = new Student()
        newStdnt.name = jui.name
        newStdnt.id = sch.SchoolName.slice(0,sch.SchoolName.indexOf(" ")) + Math.floor(Math.random() * 100000)
        newStdnt.class = jui.class
        newStdnt.subclass = jui.subClass
        newStdnt.contact = jui.pCont
        newStdnt.dateREg = new Date()
        newStdnt.photo = ''
        newStdnt.schId = sch.schoolId
        newStdnt.pwd = '123456'
        newStdnt.height = jui.height
        newStdnt.weight = jui.weight
        newStdnt.DoB = jui.DoB
        newStdnt.bGrp = jui.bGrp
        newStdnt.photo = 'http://localhost:3000/'+up.slice(27)
        console.log(newStdnt)
        try {
            newStdnt.save((e, r) => {
                if (e) throw new Error('database error . .  ' + e)
                else {
                    res.json({ code: 1, msg: 'successfully added student, Here is your Student ID; '+
                     r['id'] +'\n'+'Your default password is 123456' })
                }
            })
        } catch (e) {
            console.log(e)
            res.json({ code: 0, msg: e })
        }
    })        
    }
}).post(schAdmin+'portUpdt', async(req,res)=>{
    let sch = await school.findOne({schoolId:req.body.id})
    if (sch == null){
        return res.json({code:0,msg:'error  . . .'})
    }else{
        sch.portal = req.body.data
        try {
            sch.save((e, r) => {
                if (e) throw new Error('database error . .  ' + e)
                else {
                    r.pwd=''
                    res.json({ code: 1, msg: 'successgully updated portal',data: r})
                }
            })
        } catch (e) {
            res.json({ code: 0, msg: e })
        }
    }
}).post(schAdmin+"promoteStdnts", async(req,res)=>{
   var ft = await result.getReslts(req.body.session)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
async function  vft(result) {
    // get all results for one student by session, 3rd term, stdId
    // sum the results.total
    // avg: divide them by length of array
    // if avg is > 39 promote else remain in same class
    // repeat for all students

    
    console.log(result)
    if(result.total > 39){
        var uio = await Student.findOne({id:result.stId} )
        
        uio.class = ( parseInt (uio.class) + 1).toString()
        uio.save((e,r)=>{
            console.log(r)
        })
    }
   
}
   ft.forEach(vft)

})


// result section
.post(rslt+'submitResult',async(req,res)=>{
    let ty = await school.findOne({schId:req.body.schId})
    console.log(ty['portal'])
    if( ty['portal'] == true){
        
        if (await result.submitResult(req.body) == true){
            res.json({code:1,msg:'successfully saved result'})
        }
        else{
            res.json({code:0})
        }
    }else{
        res.json({code:0,msg:'portal closed, contact admin'})
    }
})
mstr.get(rslt+'getRslt',async(req,res)=>{
    
    console.log(req.query)
    if(await pin.checkPinUsage(req.query.pin)==true){
        res.json({code:0,msg:'pin incorrect or already exceeded validity'})
    }else{
   res.json(await result.getResult(req.query.term,req.query.id,req.query.session))

    }
})

// Update Student Info
mstr.post(schAdmin+'updateInfo',async(req,res)=>{
    var st = await Student.findOne({id:req.body.id})
    if(st){
        st[req.body.weh] = req.body.data
        try {
            st.save((e, r) => {
                if (e) throw new Error('unable to create user: ' + e)
                else {
                    res.json({ code: 1, msg: 'success',data:r })
                }
            })
        } catch (e) {
            res.json({code:0,msg:'no record found: '+e})
        }    }
    else{

        res.json({code:0,msg:'no record found'})
    }
})



mstr.get(schAdmin + 'getSubClasses/:id', async (req, res) => {
    
    var fr = await school.findOne({ schoolId: req.params.id })
    res.json(fr['subClasses'])
}).get(schAdmin + 'getSubjects/:id', async (req, res) => {
    var fr = await school.findOne({ schoolId: req.params.id })
    res.json(fr['subjects'])
})

// Auth
mstr.post(auth + 'login',async (req, res) => {
    var acct;
    console.log(req.body)
    if (req.body.id.includes('@')) {
        console.log(req.body)
        console.log('mail')
       if( await Auth.authMail(req.body) == false)
           res.json({code:0,msg:"acct doesn't exist or password incorrect"})
       else{
           acct = await Auth.authMail(req.body)
           acct['pwd'] = ''
           res.json({code:1,msg:acct})
       }
        
    } else {
        if( await Auth.authId(req.body) == false)

            res.json({code:0,msg:"acct doesn't exist or password incorrect"})
        else{
            acct = await Auth.authId(req.body)
            acct['pwd'] = ''
            res.json({code:1,msg:acct})
        }
    }
})


// Teachers
mstr.post(teacherApi+'enterResults/',async(req,res)=>{
    // create department i.e add to subjects Array
    
    
})
mstr.get(teacherApi+"getStudents/:id/:tchrid/:class",async(req,res)=>{
    try{
        
    // let lTeacher = await teacher.findOne({teacherID:req.params.tchrid})
    let lStudents = await Student.find({subclass:req.params.id,class:req.params.class})
    res.json({code:1,data:lStudents})
    }catch(e){
        res.json({code:0,msg:e})
    }
}).get(teacherApi+'getTchrSubClasses/:id',async(req,res)=>{
    let lTeacher = await teacher.findOne({teacherID:req.params.id})
    res.json(lTeacher)
})
mstr.get(teacherApi+"getMoreStudents/:id",async(req,res)=>{
    let lTeacher = await teacher.findOne({teacherID:req.params.id})
    let lStudents = await Student.find({subclass:lTeacher.subject})
})
mstr.post(teacherApi+"checkResults",async(req,res)=>{
   
    res.json(await result.checkResultBeforeSubmit(req.body))
})
mstr.get('/images/**',(req,res)=>{
    res.sendFile(__dirname + req.url )
})

// Pin

mstr.post('/pin/create',async(req,res)=>{
   
 pin.createPin(req.body.id,req.body.noOfT,res)
})
module.exports = mstr;