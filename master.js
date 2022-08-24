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
const promoter = require('./promote')
const Student = require("./schema/student");
const Result = require("./schema/result");
const result = require('./results')
const fileUpload = require("express-fileupload");
const prodSrvr = 'https://voyage-chaise-91976.herokuapp.com/'
const devSrvr = 'http://localhost:3000/'
const devSrvrFrt = 'http://localhost:4200/'
const mainSite = 'https://educat-ng.netlify.app/'
const crypto = require('crypto')
const mailer = require('./mailer')
mstr.use(fileUpload({ debug: false }))
mstr.use(express.json());
mstr.use(express.urlencoded({ extended: true }));
mstr.get('*', (req, res) => {
   
    console.log(req.url)
})
// master

mstr.post(pre + 'CreateSchool/', async (req, res) => {
    let y = await school.findOne({ email: req.body.email })
    if (y == null) {
        var id = Math.floor(Math.random() * 1000000)
        console.info(id)
        var sch = new school()
        sch.dateCreated = new Date();
        sch.email = req.body.email
        sch.schoolId = id;
        sch.portal = false
        sch.subjects = ['MATHEMATICS', 'FURTHER MATHEMATICS',
            'ENGLISH LANGUAGE', 'GEOGRAPHY',
            'BIOLOGY', 'BUSINESS STUDIES',
            'HOME ECONOMICS', 'RELIGOUS STUDIES',
            'SOCIAL STUDIES', 'CIVIC EDUCATION',
            'CHEMISTRY', 'PHYSICS', 'COMPUTER STUDIES',
            'FOOD AND NUTRITION', 'TECHNICAL DRAWING',
            'BASIC TECHNOLOGY', 'ECONOMICS', 'GOVERNMENT',
            'COMMERCE', 'ACCOUNTING', 'MARKETING',]
        sch.subClasses = ['JSS1A', 'JSS2A', 'JSS3A', 'SSS1A', 'SSS2A', 'SSS3A']
        try {
            sch.save((e, r) => {
                if (e) throw new Error('unable to create user: ' + e)
                else {
                    console.log(r)
                    let msg = `
                    <h1> Here is your school ID: ${r['schoolId']}</h1>
                    <p>Confirm your Email by click the below button</p><br>
                    <a href="${mainSite}School-Admin/actAcct/${r['schoolId']}"> 
                    <button style="    padding: 10px;
                    background-color: #067606;
                    color: white;
                    border: 0;
                    border-radius: 5px;"><h1>Reset Password</h1></button>`
                    let emailWrap = {
                        from: 'aptmachjo@outlook.com',
                        to: r['email'],
                        subject: 'Confirm Email <no reply>',
                        html: msg
                    };
                    mailer.mailFree(emailWrap)
                    res.json({ code: 1, msg: 'success, check your mail to confirm your email' })
                }
            })
        } catch (e) {
            console.info(e)
        }
    } else res.json({ code: 0, msg: "school already exists" })

})
mstr.get(pre + 'checkSchId/:id', async (req, res) => {
    // console.su('')
    let r = await school.findOne({ schoolId: req.params.id })
    if (r == null) {
        res.json({ code: 0, msg: 'school not found, check your ID and try again' })
    } else {
        res.json({ code: 1, msg: r })
    }
}).get(pre + 'checkStdntId/:id', async (req, res) => {
    // console.su('')
    let r = await Student.findOne({ schoolId: req.params.id })
    if (r == null) {
        res.json({ code: 0, msg: 'student record not found, check your ID and try again' })
    } else {
        res.json({ code: 1, msg: r })
    }
})


// School Admin section
mstr.post(schAdmin + "addTeacher", (req, res) => {
    let hash = pwdHasher('123456')
    var nTeacher = new teacher()
    nTeacher.teacherID = 'TCHR' + Math.floor(Math.random() * 1000000)
    nTeacher.subject = req.body.subjects
    nTeacher.class = req.body.personaleDet.class
    nTeacher.subClass = req.body.subClass
    nTeacher.schId = req.body.schId
    nTeacher.name = req.body.personaleDet.name
    nTeacher.dateOfEnrolMent = new Date()
    nTeacher.pwd = hash['hash']
    nTeacher.salt = hash['salt']

    try {
        nTeacher.save((e, r) => {
            if (e) throw new Error('database error . .  ' + e)
            else {
                res.json({
                    code: 1, msg: 'successfully added teacher, your id is: '
                        + r['teacherID'] + "\n" + "Your default password is: 123456, you can change it on your portal"
                })
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
    if (await pin.checkPinUsage(req.body.ActivationPin) == true) {
        res.json({ code: 0, msg: 'Pin is incorrect or already used' })
    } else {
        let hash = pwdHasher(req.body.pwd)
        let acct = await school.findOne({ schoolId: req.body.id })
        acct.SchoolName = req.body.sName
        acct.pwd = hash['hash']
        acct.salt = hash['salt']
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
    }


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
}).post(schAdmin + 'addStudent', async (req, res) => {
    var sch = await school.findOne({ schoolId: req.body.id })
    if (sch == null) {
        return res.json({ code: 0, msg: 'error  . . .' })
    } else {
        let jui = JSON.parse(req.body.formInfo)
        var up = __dirname + '/images/' + 'educat_' + Math.floor(Math.random() * 10000000000) + '.png';
        // console.log(req.files +'  kol')
        if (req.files == null) {
            res.json({ code: 0, msg: "no photo found, please include student photo" })
            return;
        } else {

            req.files.photo.mv(up, (err) => {
                let newStdnt = new Student()
                let hash = pwdHasher('123456')
                newStdnt.name = jui.name
                newStdnt.id = sch.SchoolName.slice(0, sch.SchoolName.indexOf(" ")) + Math.floor(Math.random() * 100000)
                newStdnt.class = jui.class
                newStdnt.subclass = jui.subClass
                newStdnt.contact = jui.pCont
                newStdnt.dateREg = new Date()
                newStdnt.schId = sch.schoolId
                newStdnt.height = jui.height
                newStdnt.weight = jui.weight
                newStdnt.DoB = jui.DoB
                newStdnt.sex = jui.sex
                newStdnt.bGrp = jui.bGrp
                newStdnt.pwd = hash.hash
                newStdnt.salt = hash.salt
                // newStdnt.photo = devSrvr + up.slice(27)
                newStdnt.photo = prodSrvr + up
                console.log(newStdnt)
                try {
                    newStdnt.save((e, r) => {
                        if (e) throw new Error('database error . .  ' + e)
                        else {
                            res.json({
                                code: 1, msg: 'successfully added student, Here is your Student ID; ' +
                                    r['id'] + '\n' + 'Your default password is 123456'
                            })
                        }
                    })
                } catch (e) {
                    console.log(e)
                    res.json({ code: 0, msg: e })
                }
            })
        }

    }
}).post(schAdmin + 'portUpdt', async (req, res) => {
    let sch = await school.findOne({ schoolId: req.body.id })
    if (sch == null) {
        return res.json({ code: 0, msg: 'error  . . .' })
    } else {
        sch.portal = req.body.data
        try {
            sch.save((e, r) => {
                if (e) throw new Error('database error . .  ' + e)
                else {
                    r.pwd = ''
                    res.json({ code: 1, msg: 'successgully updated portal', data: r })
                }
            })
        } catch (e) {
            res.json({ code: 0, msg: e })
        }
    }
}).post(schAdmin + "promoteStdnts", async (req, res) => {
    if(parseInt( req.body.session.slice(5)) > new Date().getFullYear()){
        res.json({code:0,msg:'The session has not started'})
    }
    else{
    let sch = await school.findOne({ schoolId: req.body.id })
     let yuo = JSON.parse(sch.sessionPromoted)
    let promtd = Object.keys(yuo)
         if(promtd.includes(req.body.session)){
            res.json({code:0,msg:'The students for this sessio are already promoted, you ca check ot pomoted list to promote a special student'})
               }else{
        var ft = await result.getReslts(req.body.session)
        let allStdnts = await Student.find({ schId: req.body.id })
        let notPromoted = []
        let arrOfFailed = []
       let yu = sch.sessionPromoted
    
       for (let index = 0; index < allStdnts.length; index++) {
            let scr = await promoter.calccForSingleStdnt(allStdnts[index]['id'], req.body.session)
            // console.log('studtID: %s , scr:%s',allStdnts[index]['id'],scr)
            if (scr > 39) {
                //   console.log("former class: %s", (await Student.findOne({id:allStdnts[index]['id']}))['class'])
                //    console.log('new class %s',)
                await promoter.promoteStdnt(allStdnts[index]['id'])
    
            }
            else {
                arrOfFailed.push(allStdnts[index]['id'])
                notPromoted.push({ stdntId: allStdnts[index]['id'], name: allStdnts[index]['name'], score: scr })
    
            }
        }
        yuo[req.body.session] = arrOfFailed
        console.log(yuo)
        sch.sessionPromoted = JSON.stringify( yuo)
        try{
            let y = await sch.save()
            console.log(y)
            res.json(notPromoted)
        }catch(e){
            res.json({code:0,msg:e})
        }
    }
    }
 

    // async function vft(result) {
    //     // get all results for one student by session, 3rd term, stdId
    //     // sum the results.total
    //     // avg: divide them by length of array
    //     // if avg is > 39 promote else remain in same class
    //     // repeat for all students




    //     console.log(result)
    //     if (result.total > 39) {
    //         var uio = await Student.findOne({ id: result.stId })

    //         uio.class = (parseInt(uio.class) + 1).toString()
    //         uio.save((e, r) => {
    //             console.log(r)
    //         })
    //     }

    // }
    // ft.forEach(vft)

}).post(schAdmin + 'updateTeacher', async (req, res) => {
    console.log(req.body)
    let tchr = await teacher.findOne({ teacherID: req.body.teacherId })
    tchr.name = req.body.personaleDet.name
    tchr.class = req.body.personaleDet.class
    tchr.subject = req.body.subject
    tchr.subClass = req.body.subClass
    try {
        await tchr.save()
        res.json({ code: 1, msg: 'successfully updated teacher' })
    } catch (e) {
        res.json({ code: 0, msg: e })
    }


}).post(schAdmin + 'updtStdt', async (req, res) => {
    var sch = await school.findOne({ schoolId: req.body.id })
    if (sch == null) {
        return res.json({ code: 0, msg: 'error  . . .' })
    } else {
        let jui = JSON.parse(req.body.formInfo)
        console.log(req.body)
        var up = __dirname + '/images/' + 'educat_' + Math.floor(Math.random() * 10000000000) + '.png';

        let newStdnt = await Student.findOne({ id: req.body.stId })
        newStdnt.name = jui.name
        newStdnt.class = jui.class
        newStdnt.subclass = jui.subClass
        newStdnt.contact = jui.pCont
        newStdnt.height = jui.height
        newStdnt.weight = jui.weight
        newStdnt.sex = jui.sex
        newStdnt.bGrp = jui.bGrp
        if (req.files == null) {

            try {
                await newStdnt.save()
                res.json({
                    code: 1, msg: 'successfully updated student'
                })
            } catch (e) {
                console.log(e)
                res.json({ code: 0, msg: e })
            }
        } else {
            req.files.photo.mv(up, async (err) => {

                // newStdnt.photo = devSrvr + up.slice(27)
                newStdnt.photo = prodSrvr + up.slice(27)
                try {
                    await newStdnt.save()
                    res.json({
                        code: 1, msg: 'successfully updated student'
                    })
                } catch (e) {
                    console.log(e)
                    res.json({ code: 0, msg: e })
                }
            })
        }

    }
})
    // result section
    .post(rslt + 'submitResult', async (req, res) => {
        let ty = await school.findOne({ schoolId: req.body.schId })
        // console.log(req.body)
        if (ty['portal'] == true) {
            if (await result.submitResult(req.body) == true) {
                res.json({ code: 1, msg: 'successfully saved result' })
            }
            else {
                res.json({ code: 0 })
            }
        } else {
            res.json({ code: 0, msg: 'portal closed, contact admin' })
        }
    })




function pwdHasher(pwd) {
    let salt = crypto.randomBytes(16).toString('hex');
    let hash = crypto.pbkdf2Sync(pwd, salt,
        1000, 64, `sha512`).toString(`hex`);
    return { hash: hash, salt: salt }
}

mstr.get(rslt + 'getRslt', async (req, res) => {
    if (await pin.checkPinUsage(req.query.pin,req.query.term,req.query.session,req.query.id) == true) {
        res.json({ code: 0, msg: 'pin incorrect or already exceeded validity' })
    } else {
        res.json(await result.getResult(req.query.term, req.query.id, req.query.session))

    }
}).get(rslt + 'stdntAvg/:stId/:schId/:term/:session/:sen', async (req, res) => {
    res.json(await result.calcStdntAvg(req.params.stId,req.params.schId, req.params.term, req.params.session + "/" + req.params.sen))
}).get(rslt + 'stdntPosition/:stId/:schId/:term/:class/:subclass/:session/:sen', async (req, res) => {
    let llid = await 
    Student.find({ class: req.params.class,schId:req.params.schId, subclass: req.params.subclass })
    let arr = []
    for (let index = 0; index < llid.length; index++) {
        arr.push(await promoter.calccForSingleStdnt(llid[index]['id'], req.params.session + "/" + req.params.sen, req.params.term))
    }
    let ry = await promoter.calccForSingleStdnt(req.params.stId, req.params.session + "/" + req.params.sen, req.params.term)
    let arrSorted = arr.sort((function (a, b) { return b - a }))
    res.json({code:1,position:arrSorted.indexOf(ry) + 1, noInClass:arrSorted.length})
    // res.json(await result.calcStdntAvg(req.params.stId,req.params.term,req.params.session+"/"+req.params.sen)   )
}).get(rslt + 'classAvg/:stId/:schId/:term/:class/:subClass/:session/:sen', async (req, res) => {
    res.json(await result.classAvg(req.params.class, req.params.subClass, req.params.schId,
        req.params.term, req.params.session + "/" + req.params.sen))
}).get(schAdmin+'stdntPins/:id',async(req,res)=>{
   res.json(await pin.myPins(req.params.id))
})

// Update Student Info
mstr.post(schAdmin + 'updateInfo', async (req, res) => {
    var st = await Student.findOne({ id: req.body.id })
    if (st) {
        st[req.body.weh] = req.body.data
        try {
            st.save((e, r) => {
                if (e) throw new Error('unable to create user: ' + e)
                else {
                    res.json({ code: 1, msg: 'success', data: r })
                }
            })
        } catch (e) {
            res.json({ code: 0, msg: 'no record found: ' + e })
        }
    }
    else {

        res.json({ code: 0, msg: 'no record found' })
    }
})



mstr.get(schAdmin + 'getSubClasses/:id', async (req, res) => {
    let ft = await school.findOne({ schoolId: req.params.id })
    try {
        res.json(ft['subClasses'])
    } catch (e) {
        res.json(e)
    }
}).get(schAdmin + 'getSubjects/:id', async (req, res) => {
    var fr = await school.findOne({ schoolId: req.params.id })
    res.json(fr['subjects'])
}).get(schAdmin + 'tchrDet/:id', async (req, res) => {
    res.json(await teacher.findOne({ teacherID: req.params.id }))
}).get(schAdmin + 'stdntDet/:id', async (req, res) => {
    console.log(req.params.id)
    res.json(await Student.findOne({ id: req.params.id }))
})

// Auth
mstr.post(auth + 'login', async (req, res) => {
    var acct;
    console.log(req.body)
    if (req.body.id.includes('@')) {
        console.log(req.body)
        console.log('mail')
        if (await Auth.authMail(req.body) == false)
            res.json({ code: 0, msg: "acct doesn't exist or password incorrect" })
        else {
            acct = await Auth.authMail(req.body)
            acct['pwd'] = ''
            res.json({ code: 1, msg: acct })
        }

    } else {
        if (await Auth.authId(req.body) == false)

            res.json({ code: 0, msg: "acct doesn't exist or password incorrect" })
        else {
            acct = await Auth.authId(req.body)
            acct['pwd'] = ''
            res.json({ code: 1, msg: acct })
        }
    }
})


// Teachers
mstr.post(teacherApi + 'enterResults/', async (req, res) => {
    // create department i.e add to subjects Array


})
mstr.get(teacherApi + "getStudents/:id/:schId/:class", async (req, res) => {
    try {
        let lStudents = await Student.find({ subclass: req.params.id, schId:req.params.schId,class: req.params.class })
        res.json({ code: 1, data: lStudents })
    } catch (e) {
        res.json({ code: 0, msg: e })
    }
}).get(teacherApi + 'getTchrSubClasses/:id', async (req, res) => {
    let lTeacher = await teacher.findOne({ teacherID: req.params.id })
    res.json(lTeacher)
})
mstr.get(teacherApi + "getMoreStudents/:id", async (req, res) => {
    let lTeacher = await teacher.findOne({ teacherID: req.params.id })
    let lStudents = await Student.find({ subclass: lTeacher.subject })
})
mstr.post(teacherApi + "checkResults", async (req, res) => {
    let array = await Student.find({ class: req.body.class, subclass: req.body.subclass })
    let arr = await result.checkResultBeforeSubmit(req.body)
    if (arr.length == 0) {
        res.json(arr)
    }
    else if (array.length > arr.length) {

        let yu = []
        let yuu = []
        let abs = []
        // res.json(await result.checkResultBeforeSubmit(req.body))
        for (let index = 0; index < array.length; index++) {
            yu.push(array[index]['id'])
        }
        for (let index = 0; index < arr.length; index++) {
            yuu.push(arr[index]['stId'])
        }
        for (let index = 0; index < yu.length; index++) {
            if (!yuu.includes(yu[index])) {
                abs.push(yu[index])
            }
        }
        for (let index = 0; index < abs.length; index++) {
            let currStdnt = await Student.findOne({ id: abs[index] })
            let rslt = new Result()
            rslt.term = req.body.term
            rslt.subject = req.body.subject
            rslt.stId = abs[index]
            rslt.testScr = ''
            rslt.ExamScr = ''
            rslt.total = ''
            rslt.Grade = ''
            rslt.lastUpdated = ''
            rslt.lastUpdatedBy = ''
            rslt.schId = currStdnt['schId']
            rslt.session = req.body.session
            rslt.class = req.body.class
            rslt.subclass = req.body.subclass
            rslt.name = currStdnt['name']

            try {
                arr.push(await rslt.save())
            } catch (error) {
                console.log(error)
            }
        }
        res.json(arr)
        console.log("students: %s, reslts: %s, absent: %s", yu, yuu, abs)
    }
    else {
        res.json(arr)
    }
})
mstr.get('/images/**', (req, res) => {
    res.sendFile(__dirname + req.url)
})

mstr.get('/mstr/getRstDet/:id', async (req, res) => {
    //Student
    // for students and teachers implement such that they have to get written note from parent of guardian an
    // and meet schoold admin to change password
    console.log(req.params)
    let msg = ''
    let emailWrap = {}
    let acct = await Student.findOne({ id: req.params.id })

    if (acct == null) {
        //Teacher
        acct = await teacher.findOne({ teacherID: req.params.id })
        // console.log(acct)
        if (acct == null) {
            //school
            acct = await school.findOne({ schoolId: req.params.id })
            if (acct == null)
                res.json({ code: 0 })
            else {
                msg = `<h1>Hey Admin</h1>
                    <p>We received a request to change your password for ${acct['SchoolName']}. \n 
                    if this was you, click this button below to reset your password. 
                    <a href="${mainSite}resetPwd/${acct['schoolId']}"> 
                    <button style="    padding: 10px;
                    background-color: #067606;
                    color: white;
                    border: 0;
                    border-radius: 5px;"><h1>Reset Password</h1></button> </a>
                    `
                emailWrap = {
                    from: 'aptmachjo@outlook.com',
                    to: 'infiniteflow.llp@gmail.com',
                    subject: 'Reset password',
                    html: msg
                };
                mailer.mailFree(emailWrap)
            }

        } else {
            msg = `<h1>Hey there</h1>
            <p>Graceful tutor, we received a request to change your password. \n 
            if this was you, click this button below to reset your password. 
            <a href="${mainSite}resetPwd/${acct['teacherID']}"> 
            <button style="    padding: 10px;
            background-color: #067606;
            color: white;
            border: 0;
            border-radius: 5px;"><h1>Reset Password</h1></button> </a>
            `
            emailWrap = {
                from: 'aptmachjo@outlook.com',
                to: 'infiniteflow.llp@gmail.com',
                subject: 'Reset password',
                html: msg
            };
            mailer.mailFree(emailWrap)

            // mailer.mailNow(emailWrap)
        }
    } else {
        msg = `<h1>Hey there</h1>
    <p>${acct['name']} we received a request to change your password. \n 
    if this was you, click this button below to reset your password.<br> 
    <a href="${mainSite}resetPwd/${acct['id']}"> 
    <button style="    padding: 10px;
    background-color: #067606;
    color: white;
    border: 0;
    border-radius: 5px;"><h1>Reset Password</h1></button> </a>
    `
        emailWrap = {
            from: 'aptmachjo@outlook.com',
            to: 'infiniteflow.llp@gmail.com',
            subject: 'Reset password',
            html: msg
        };
        mailer.mailFree(emailWrap)
        // mailer.mailNow(emailWrap)
    }
})
mstr.post('/mstr/createNewPwd', async (req, res) => {
    //Student
    let acct = await Student.findOne({ id: req.body.id })
    // console.log(acct)

    if (acct == null) {
        //Teacher
        acct = await teacher.findOne({ teacherID: req.body.id })
        // console.log(acct)
        if (acct == null) {
            //school
            acct = await school.findOne({ schoolId: req.body.id })
            if (acct == null) {
                res.json({ code: 0 })

            } else {
                let hashSch = pwdHasher(req.body.pwd)
                acct.pwd = hashSch.hash
                acct.salt = hashSch.salt
                try {
                    await acct.save()
                    res.json({ code: 1, msg: 'successfully reset paasword, you can now sign in' })
                } catch (e) {
                    res.json({ code: 0 })
                    console.log(e)
                }
            }
        } else {

            let hashTchr = pwdHasher(req.body.pwd)
            acct.pwd = hashTchr.hash
            acct.salt = hashTchr.salt
            try {
                await acct.save()
                res.json({ code: 1, msg: 'successfully reset paasword, you can now sign in' })

            } catch (e) {

                res.json({ code: 0 })
                console.log(e)
            }
        }

    } else {
        let hashStdnt = pwdHasher(req.body.pwd)
        acct.pwd = hashStdnt.hash
        acct.salt = hashStdnt.salt
        try {
            await acct.save()
            res.json({ code: 1, msg: 'successfully reset paasword, you can now sign in' })

        } catch (e) {
            res.json({ code: 0 })
            console.log(e)
        }
    }
})

// Pin
mstr.post('/pin/create', async (req, res) => {

    pin.createPin(req.body.id, req.body.noOfT, res)
})
module.exports = mstr;