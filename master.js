'use strict'

var express = require("express");
const mstr = express.Router();
const school = require('./schema/school')
const nataSch = require('./school')
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
const mainSite = 'https://reportkad.netlify.app/'
const crypto = require('crypto')
const mailer = require('./mailer')
mstr.use(fileUpload({ debug: false }))
mstr.use(express.json());
mstr.use(express.urlencoded({ extended: true }));
const trxHis = require('./schema/trxns')
const tutoUser = require('./schema/tutoUser')
const book = require('./schema/book');
const author = require("./schema/author");
// mstr.get('*', (req, res) => {
//     console.log(req.url)
//    if(req.url.includes('.png')){
//     res.sendFile(__dirname + req.url)

// }    
//    else if(req.url.includes('.jpg')){
//     res.sendFile(__dirname + req.url)

//    }
//     else if(req.url.includes('.jpeg')){
//         res.sendFile(__dirname + req.url)

//     }
//    else if(req.url.includes('.jfif')){
//     res.sendFile(__dirname + req.url)

// }else{
//     res.redirect(req.url)

// }

// })
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
                        from: 'reportkad@outlook.com',
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
        if (req.files != null) {
            res.json({ code: 0, msg: "no photo found, please include student photo" })
            return;
        } else {

            // req.files.photo.mv(up, (err) => {
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
            newStdnt.photo = jui.photo
            // newStdnt.photo = prodSrvr + up
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
            // })
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
    if (parseInt(req.body.session.slice(5)) > new Date().getFullYear()) {
        res.json({ code: 0, msg: 'The session has not started' })
    }
    else {
        let sch = await school.findOne({ schoolId: req.body.id })
        console.log(typeof sch.sessionPromoted)
        if (!sch.sessionPromoted) {
            var ft = await result.getReslts(req.body.session, req.body.id)
            let allStdnts = await Student.find({ schId: req.body.id })
            let notPromoted = []
            let arrOfFailed = []
            let yu = {}
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
            yu[req.body.session] = arrOfFailed
            sch.sessionPromoted = JSON.stringify(yu)
            try {
                let y = await sch.save()
                res.json(notPromoted)
            } catch (e) {
                res.json({ code: 0, msg: e })
            }

        } else {
            let yuo = JSON.parse(sch.sessionPromoted)
            let promtd = Object.keys(yuo)
            if (promtd.includes(req.body.session)) {
                res.json({ code: 0, msg: 'The students for this session are already promoted, you ca check ot pomoted list to promote a special student' })
            } else {
                var ft = await result.getReslts(req.body.session, req.body.id)
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
                yu[req.body.session] = arrOfFailed
                sch.sessionPromoted = JSON.stringify(yuo)
                try {
                    let y = await sch.save()
                    res.json(notPromoted)
                } catch (e) {
                    res.json({ code: 0, msg: e })
                }
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
    let tchr = await teacher.findOne({ teacherID: req.body.teacherId })
    tchr.name = req.body.personaleDet.name
    tchr.class = req.body.personaleDet.class
    if (req.body.subjects != []) {
        tchr.subject = req.body.subjects
    } else {

    }
    if (req.body.subClass != []) {
        tchr.subClass = req.body.subClass
    } else {

    }
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
}).post(schAdmin + 'promoteSingleStdnt', async (req, res) => {
    let sch = await school.findOne({ schoolId: req.body.schId })
    let sessionPromtd = JSON.parse(sch.sessionPromoted)
    if (!req.body.session) {
        req.body.session = (new Date().getFullYear() - 1).toString() + '/' + new Date().getFullYear().toString()
    }
    let arr = sessionPromtd[req.body.session]

    if (!arr.includes(req.body.id)) {
        res.json({ code: 0, msg: 'student already promoted' })
    } else {
        let stdnt = await Student.findOne({ id: req.body.id })
        stdnt.class = parseInt(stdnt.class) + 1

        // remove stdnt from array of not promoted for that session
        var filteredArray = arr.filter(function (e) { return e !== req.body.id })
        sessionPromtd[req.body.session] = filteredArray
        sch.sessionPromoted = JSON.stringify(sessionPromtd)

        try {
            await sch.save()
            await stdnt.save()
            res.json({ code: 1, msg: 'successfully promoted student' })
        } catch (e) {
            res.json({ code: 0, msg: e })
        }
    }

}).post(schAdmin + 'addInfo', async (req, res) => {
    let sch = await school.findOne({ schoolId: req.body.id })
    sch.infoBrd = req.body.Subjt
    try {
        sch.save()
        res.json({ code: 1, msg: 'successfully published information' })
    } catch (e) { res.json({ code: 0, msg: 'error: ' + e }) }
}).post(schAdmin + 'savePhotoLink', async (req, res) => {
    let sch = await school.findOne({ schoolId: req.body.schId })
    sch[req.body.type] = req.body.link
    console.log(req.body)
    try {
        await sch.save()
        res.json({ code: 1 })
    } catch (e) {
        console.log(e)
        res.json({ code: 0, msg: e })
    }
}).post(schAdmin + 'submitCmts', async (req, res) => {
    try {
        let sch = await school.findOne({ schoolId: req.body.schId })
        console.log(req.body); sch.comments = req.body
        await sch.save()
        res.json({ code: 1 })
    } catch (e) {
        console.log(e)
        res.json({ code: 0, msg: e })
    }
})
    .get(schAdmin + 'getList', async (req, res) => {
        if (req.query.type == "S") {
            res.json(await Student.find({ schId: req.query.schId }).limit(50))
        } else if (req.query.type == "T") {
            res.json(await teacher.find({ schId: req.query.schId }).limit(50))

        }
    }).get(schAdmin + 'getSubclass/:id/:schId', async (req, res) => {
        let yu = await school.findOne({ schoolId: req.params.schId })
        res.json(yu['subClasses'])
    }).get(schAdmin + 'stdtsNotPrmtd/:schId', async (req, res) => {
        let sch = await school.findOne({ schoolId: req.params.schId })
        let hld = JSON.parse(sch.sessionPromoted)
        let yu = (new Date().getFullYear() - 1).toString() + '/' + new Date().getFullYear().toString()
        let finArr = []
        let rt = {}
        for (let index = 0; index < hld[yu].length; index++) {
            const element = hld[yu][index];
            let st = await Student.findOne({ id: element })
            // console.log("id: &s,Name: &s, ",element,st['name'])
            // console.log()
            if (!st) {
                rt = { name: 'not found', class: 'not found', scr: 'not found' }
                finArr.push(rt)
            } else {

                rt = { name: st['name'], stdntId: st['id'], class: st['subclass'] }
                rt['score'] = await promoter.calccForSingleStdnt(element, yu)
                finArr.push(rt)
            }

        }
        res.json({ code: 1, msg: finArr })
        // promoter.calccForSingleStdnt()
        // console.log(yu)

    })
    // result section
    .post(rslt + 'submitResult', async (req, res) => {
        let ty = await school.findOne({ schoolId: req.body.schId })
        console.log(req.body)
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
mstr.get(rslt + 'getBrdSht', async (req, res) => {
    try {
        res.json(await Result.find(req.query))
    } catch (e) {
        res.json({ code: 0, msg: 'error occured' })
    }
})

function pwdHasher(pwd) {
    let salt = crypto.randomBytes(16).toString('hex');
    let hash = crypto.pbkdf2Sync(pwd, salt,
        1000, 64, `sha512`).toString(`hex`);
    return { hash: hash, salt: salt }
}

mstr.get(rslt + 'getRslt', async (req, res) => {
    if (await pin.checkPinUsage(req.query.pin, req.query.term, req.query.session, req.query.id) == true) {
        res.json({ code: 0, msg: 'pin incorrect or already exceeded validity' })
    } else {
        res.json(await result.getResult(req.query.term, req.query.id, req.query.session))

    }
}).get(rslt + 'stdntAvg/:stId/:schId/:term/:session/:sen', async (req, res) => {
    res.json(await result.calcStdntAvg(req.params.stId, req.params.schId, req.params.term, req.params.session + "/" + req.params.sen))
}).get(rslt + 'stdntPosition/:stId/:schId/:term/:class/:subclass/:session/:sen', async (req, res) => {
    let llid = await
        Student.find({ class: req.params.class, schId: req.params.schId, subclass: req.params.subclass })
    let arr = []
    for (let index = 0; index < llid.length; index++) {
        arr.push(await promoter.calccForSingleStdnt(llid[index]['id'], req.params.session + "/" + req.params.sen, req.params.term))
    }
    let ry = await promoter.calccForSingleStdnt(req.params.stId, req.params.session + "/" + req.params.sen, req.params.term)
    let arrSorted = arr.sort((function (a, b) { return b - a }))
    res.json({ code: 1, position: arrSorted.indexOf(ry) + 1, noInClass: arrSorted.length })
    // res.json(await result.calcStdntAvg(req.params.stId,req.params.term,req.params.session+"/"+req.params.sen)   )
}).get(rslt + 'classAvg/:stId/:schId/:term/:class/:subClass/:session/:sen', async (req, res) => {
    res.json(await result.classAvg(req.params.class, req.params.subClass, req.params.schId,
        req.params.term, req.params.session + "/" + req.params.sen))
}).get(schAdmin + 'stdntPins/:id', async (req, res) => {
    res.json(await pin.myPins(req.params.id))
}).get(schAdmin + 'getRdmDet', async (req, res) => {
    let details = null;
    try {
        if (req.query.type = 'school') {
            details = await school.findOne({ schoolId: req.query.id })
            res.json({ code: 1, msg: details })
        } else if (req.query.type = 'student') { }
        else if (req.query.type = 'teacher') { }
    } catch (e) {
        res.json({ code: 1, msg: 'error occured: ' + e })

    }
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
    res.json(await Student.findOne({ id: req.params.id }))
})
mstr.delete(schAdmin + 'deleteUser', async (req, res) => {
    let u = null
    console.log(req.query)
    if (req.query.userType == 'T') {
        try {
            await teacher.findByIdAndDelete(req.query.id)
            res.json({ code: 1, msg: "successfully deleted" })
        } catch (e) {
            res.json({ code: 0, msg: e })
        }
    } else if (req.query.userType == 'S') {
        try {
            await Student.findByIdAndDelete(req.query.id)
            res.json({ code: 1, msg: "successfully deleted" })
        } catch (e) {
            res.json({ code: 0, msg: e })
        }
    }
})


// Auth
mstr.post(auth + 'login', async (req, res) => {
    var acct;
    if (req.body.id.includes('@')) {
        console.log(req.body.id)
        console.log('mail')
        if (await Auth.authMail(req.body, res) == false)
            res.json({ code: 0, msg: "acct doesn't exist or password incorrect" })
        else {
            acct = await Auth.authMail(req.body)
            acct['pwd'] = ''
            res.json({ code: 1, msg: acct })
        }

    } else {
        if (await Auth.authId(req.body, res) == false)

            res.json({ code: 0, msg: "acct doesn't exist or password incorrect" })
        else {
            acct = await Auth.authId(req.body, res)
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
        let lStudents = await Student.find({ subclass: req.params.id, schId: req.params.schId, class: req.params.class })
        res.json({ code: 1, data: lStudents })
    } catch (e) {
        res.json({ code: 0, msg: e })
    }
}).get(teacherApi + 'getTchrSubClasses/:id', async (req, res) => {
    let lTeacher = await teacher.findOne({ teacherID: req.params.id })
    res.json(lTeacher)
}).get(teacherApi + 'getTchrSubject/:id/:schId', async (req, res) => {
    let io = await teacher.findOne({ teacherID: req.params.id, schId: req.params.schId }); res.json(io['subject'])
})
mstr.get(teacherApi + "getMoreStudents/:id", async (req, res) => {
    let lTeacher = await teacher.findOne({ teacherID: req.params.id })
    let lStudents = await Student.find({ subclass: lTeacher.subject })
})
mstr.post(teacherApi + "checkResults", async (req, res) => {
    // console.log(req.body)
    let array = await Student.find({ class: req.body.class, subclass: req.body.subclass, schId: req.body.schId })
    let arr = await result.checkResultBeforeSubmit({ class: req.body.class, subclass: req.body.subclass, schId: req.body.schId, session: req.body.session, subject: req.body.subject, term: req.body.term })
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
            rslt.testScr1 = ''
            rslt.testScr2 = ''
            rslt.testScr3 = ''
            rslt.testScr4 = ''
            rslt.ExamScr = ''
            rslt.total = ''
            rslt.Grade = ''
            rslt.lastUpdated = ''
            // rslt.lastUpdatedBy = ''
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
    let pins = []
    if (req.body.noOfPins > 1) {
        for (let index = 0; index < req.body.noOfPins; index++) {
            pins.push(await pin.createPin(req.body.id, req.body.noOfT, res, req.body.schId))
        }
        res.json({ code: 1, msg: pins })

    } else {
        let r = await pin.createPin(req.body.id, req.body.noOfT, res)
        res.json({ code: 1, msg: r })
    }
})

// tuto

// auth
// Auth


mstr.post('/apiTuto/auth/login', async (req, res) => {
    let r = await tutoUser.findOne({ email: req.body.email })
    console.log(r)
    if (r == null) {
        res.json({ code: 0, msg: 'account not found' })
    } else {
        if (await r.validPassword(req.body.pwd)) {
            r.hash = ''
            r.salt = ''
            res.json({ code: 1, msg: r })
        }
        else {
            res.json({ code: 0, msg: 'incorrect password' })

        }
    }

})
mstr.post('/apiTuto/auth/register', async (req, res) => {
    let usere = new tutoUser()
    // let usere = new Student()

    // console.log(await usere.findOne({id:"ddd"}))

    try {
        let io = await tutoUser.find({ email: req.body.email })
        if (io.length != 0) {
            res.json({ code: 0, msg: 'account already exists' })
        } else {
            usere.name = req.body.name
            usere.email = req.body.email
            usere.coins = 0
            usere.genres = req.body.genres
            usere.contact = req.body.contact
            usere.setPassword(req.body.pwd)

            let account_no = Math.floor(Math.random() * 10000000000)
            let yu = await tutoUser.find({ account_no: account_no })
            console.log(yu)
            while (yu.length != 0) {
                account_no = Math.floor(Math.random() * 10000000000)
                yu = await tutoUser.find({ account_no: account_no })
            }
            usere.account_no = account_no
            let y = await usere.save()
            console.log(y)
            let msg = `
                <h1> Here is your Welcome Bonus Code: ${"TOYO" + Math.floor(Math.random() * 10000)}</h1>
                <i>Much Love From TOYO</i>
                `
            let emailWrap = {
                from: 'reportkad@outlook.com',
                to: y['email'],
                subject: 'Toyo Free Book App: Confirm Email <no reply>',
                html: msg
            };
            mailer.mailFree(emailWrap)
            res.json({ code: 1, msg: 'success, check your mail to confirm your email' })
            // res.json({code:1,msg:y})
        }
    } catch (e) {
        console.log(e)
        res.json({ code: 0, msg: e })
    }
})
mstr.get('/apiTuto/getBookRead', async (req, res) => {
    try {
        let user = await tutoUser.findOne({ id: req.query.userId })
        if (user != null) {
            let y = []
            if (user.listOfPurchasedBooks.includes(req.query.bookId)) {
                let bk = await book.findOne()
                res.json({ code: 1, msg: bk })
            }
            else if (user.listOfBooksReadingByCoins.includes(req.query.bookId)) {

            }
        } else {

        }
    } catch (e) {
        console.log(e)
        res.json({ code: 0, msg: e })
    }
})
    .post('/apiTuto/commentAboutBook', async (req, res) => {
        try {
            let bk = book.findOne({ id: req.query.bookId })
            let cmts = bk.comments
            let cmt = { userId: req.query.userId, comment: req.query.comment }
            cmts.push(cmt)
            cmts.save()
        }
        catch (e) {
            console.log(e)
            res.json({ code: 0, msg: e })
        }
    })
mstr.get('/apiTuto/getResource', async (req, res) => {
    function sendData(data) {
        res.json({ code: 1, msg: data })
    }
    let resr = null
    try {
        if (req.query.type == 'user') {
            resr = await tutoUser.findOne({ account_no: req.query.id })
            if (req.query.cat == 'photo') {
                sendData(resr.photo)
            }
            else if (req.query.cat == 'name') {
                sendData(resr.name)
            }
            else if (req.query.cat == 'about') {
                sendData(resr.about)
            }
            else if (req.query.cat == 'stars') {
                sendData(resr.stars)
            }
            else {
                sendData(resr.comments)
            }
        }
        else if (req.query.type == 'author') {
            resr = await author.findOne({ id: req.query.id })
            //    console.log(resr)
            if (req.query.cat == 'photo') {
                sendData(resr.photo)
            }
            else if (req.query.cat == 'name') {
                sendData(resr['name'])
            }
            else if (req.query.cat == 'about') {
                sendData(resr.about)
            }
            else if (req.query.cat == 'stars') {
                sendData(resr.stars)
            }
            else {
                sendData(resr.comments)
            }
        }
        else if (req.query.type == 'book') {
            resr = await book.findOne({ id: req.query.id })

            if (req.query.cat == 'link') {
                sendData(resr.link)
            }
            else if (req.query.cat == 'title') {
                sendData(resr.title)
            }
            else if (req.query.cat == 'about') {
                sendData(resr.about)
            }
            else if (req.query.cat == 'stars') {
                sendData(resr.noOfStars)
            }

            else if (req.query.cat == 'comment') {
                sendData(resr.comments)
            }
            else {
                sendData(resr.comments)

            }
        }
    }
    catch (e) {
        console.log(e)
        res.json({ code: 0, msg: e })
    }
})
    .get('/apiTuto/getBook', async (req, res) => {
        try {
            console.log(req.query.bookId)
            res.json(await book.findOne({ bookId: req.query.bookId }))
        } catch (e) {
            res.json({ code: 0, msg: "error: " + e })
        }

    }).get("/apiTuto/admin/getAuthors", async (req, res) => {
        try {
            let y = await author.find()
            let resw = []
            for (let index = 0; index < y.length; index++) {
                resw.push({ id: y[index]['id'], name: y[index]['name'] })
            }
            res.json({ code: 1, msg: resw })
        } catch (e) {
            res.json({ code: 0, msg: 'error: ' + e })
            console.log(e)
        }
    }).get("/apiTuto/listBooks", async (req, res) => {
        let u = await tutoUser.findOne({ account_no: req.query.account_no })
        let bks = await book.find()
        let re = []
        let nor = []
        let max = 0
        let hldr = {}
        let mstRtd = []
        // console.log(u)

        if (req.query.cat == 'bksforyou') {
            try {
                // console.log(u)
                for (let index = 0; index < u['genres'].length; index++) {
                    for (let indexx = 0; indexx < bks.length; indexx++) {
                        if (bks[indexx]['genres'].includes(u['genres'][index])) {
                            if (req.query.further == 'true') {
                                re.push(bks[indexx])
                            } else {
                                if (re.length > 4) {
                                    indexx = bks.length
                                    index = u['genres'].length
                                    break;
                                }
                                re.push(bks[indexx])
                            }
                        }
                    }
                }
            }

            catch (e) {
                console.log("error: " + e)
            }
        }
        else if (req.query.cat == 'genres') {
            try {
                for (let indexx = 0; indexx < bks.length; indexx++) {
                    if (bks[indexx]['genres'].includes(req.query.genres)) {

                        re.push(bks[indexx])
                    }

                }
            } catch (error) {
                console.log("err" + error)
            }
        }
        else if (req.query.cat == 'trending') {
            try {
                if (req.query.further == 'true') {

                    for (let i = 0; i < 20; i++) {
                        // get the id of book from the trends array; find the book and posh into books array 
                        // re.push(await book.findOne({ bookId: (Object.values(trendArrF[i]))[0] }))
                        re.push(trendArrF[i])
                    }
                }
                else {
                    for (let i = 0; i < 5; i++) {
                        re.push(trendArrF[i])
                       
                        // re.push(await book.findOne({ bookId: (Object.values(trendArrF[i]))[0] }))
                    }
                }
            } catch (e) {
                console.log('error: ' + e)
            }
        }
        else if (req.query.cat == 'crtReadng') {
            if(u['listOfBooksReadingByCoins'].length == 0){
                res.json({code:1,msg:'none'})
            }else{

                for (let lm = 0; lm < u['listOfBooksReadingByCoins'].length; lm++) {
                    console.log(u['listOfBooksReadingByCoins'][lm])
                    re.push(await book.findOne({ bookId: u['listOfBooksReadingByCoins'][lm] }))
                }
            }
        }
        else if (req.query.cat == 'favAut') {
            let d = []
            if (req.query.further == 'true') {

                for (let opa = 0; opa < u['favAut'].length; opa++) {
                    d = (await book.find({ author: u['favAut'][opa] }))
                    for (let index = 0; index < d.length; index++) {
                        re.push(d[index]);
                    }
                }
            } else {
                for (let opa = 0; opa < u['favAut'].length; opa++) {
                    d = (await book.find({ author: u['favAut'][opa] }))
                    for (let index = 0; index < d.length; index++) {
                        re.push(d[index]);
                    }
                }
            }
        }

        else if (req.query.cat == 'popular') {
            // based on noOfReads
            for (let indexx = 0; indexx < bks.length; indexx++) {
                nor.push(bks[indexx]['noOfReads'])
            }
            nor.sort(function (a, b) { return b - a})            
            if (req.query.further == 'true') {
                for (let index = 0; nor.length; index++) {
                    re.push(await book.findOne({ noOfReads: nor[index] }))
                }
            } else {
                for (let index = 0; index < 5; index++) {
                    re.push(await book.findOne({ noOfReads: nor[index] }))
                }
            }
        }
        else if (req.query.cat = 'mostRated') {
            // get star value for each book and place them in any array 
            for (let indexx = 0; indexx < bks.length; indexx++) {
                mstRtd.push(bks[indexx]['noOfStars'])
            }
            // sort the array
            mstRtd.sort(function (a, b) { return b - a })
            // get all the books using the ranking of their star
            if (req.query.further == 'true') {
                for (let index = 0; index < mstRtd.length; index++) {
                    console.log(mstRtd + 'further , , ,')
                    
                    re.push(await book.findOne({ noOfStars: mstRtd[index] }))
                }
            } else {
                for (let index = 0; index < 5; index++) {
                    console.log(mstRtd)
                    re.push(await book.findOne({ noOfStars: mstRtd[index] }))
                }

            }
        }
        res.json(re)
    }).get("/apiTuto/postCoin", async (req, res) => {
        let t = await tutoUser.findOne({account_no:req.query.user});
        t.coins = parseInt(t.coins) + parseInt(req.query.amt);
        await t.save()
        t.salt = ''
        t.hash = ''
        res.json({code:1,msg:'Congrats you have successfully purchased '+req.query.amt+" coins",u:t})
        let trv = new trxHis()
        trv.id = req.query.ref
        trv.userId = req.query.user
        trv.coins = req.query.amt
        trv.amount = req.query.amtCsh
        trv.date = new Date()
        trv.save()
    }).get("/apiTuto/removeCoin", async (req, res) => {
        let t = tutoUser.findOne({account_no:req.query.user})
        if(parseInt(t.coins) - parseInt(req.query.amt) < 0){
        res.json({code:0,msg:" coins insuffucient"})
        }else{
            t.coins = parseInt(t.coins) - parseInt(req.query.amt) 
            t.save()
        }
        res.json({code:1})
        
    })

function arrayMin(arr) {
    var len = arr.length, min = Infinity;
    while (len--) {
        if (arr[len] < min) {
            min = arr[len];
        }
    }
    return min;
};

function arrayMax(arr) {
    var len = arr.length, max = -Infinity;
    while (len--) {
        if (arr[len] > max) {
            max = arr[len];
        }
    }
    return max;
};
mstr.get('/apiTuto/getComments', async (req, res) => {
    let re = (await book.findOne({ bookId: req.query.bookId }))['comments']
    res.json({ code: 1, msg: re })

}).get('/apiTuto/comment', async (req, res) => {
    console.log(req.query)
    try {
        let re = (await book.findOne({ bookId: req.query.bookId }))
        re['comments'].push({ user: req.query.user, value: req.query.value })
        await re.save()
        res.json({ code: 1, msg: re })
    } catch (e) {
        console.log(e)
        res.json({ code: 0, msg: 'error: ' + e })
    }

}).get('/apiTuto/getCommentCount', async (req, res) => {
    let re = (await book.findOne({ bookId: req.query.bookId }))['comments']
    res.json({ code: 1, msg: re.length })
})
    .get('/apiTuto/admin/dashoardInfo', async (req, res) => {
        let y = {}
        try {

            y['noOfBks'] = (await book.find()).length
            y['noOfUsers'] = (await tutoUser.find()).length
            y['noOfAuthors'] = (await author.find()).length
            res.json({ code: 1, msg: y })

        } catch (e) {
            console.log(e)
            res.json({ code: 0, msg: e })
        }
    }).get('/apiTuto/admin/list', async (req, res) => {
        let y = await book.find().limit(10)
        let yw = await author.find().limit(10)

        res.json({ code: 1, msg: { bk: y, atr: yw } })
    })

mstr.post('/apiTuto/admin/addAuthor', async (req, res) => {
    console.log(req.body)
    let y = new author()
    y['name'] = req.body.name
    y['about'] = req.body.about
    y['photo'] = req.body.photo
    y['id'] = 'tuto' + Math.floor(Math.random() * 10000000000)
    y['dateCreated'] = new Date()
    y['noOfStars'] = req.body.stars

    try {
        let s = await y.save()
        res.json({ code: 1, msg: "successfully added Author" })
    } catch (e) {
        console.log(e)
        res.json({ code: 0, msg: 'error: ' + e })
    }
})
mstr.post('/apiTuto/admin/uploadBook', async (req, res) => {
    console.log(req.body)
    let y = new book()
    y['bookArt'] = req.body.bookCova
    y['title'] = req.body.name
    y['linkJSON'] = req.body.JSON
    y['linkPdf'] = req.body.pdf
    y['author'] = req.body.author
    y['aboutBook'] = req.body.about
    y['genres'] = req.body.genres
    y['preface'] = req.body.preface
    y['content'] = req.body.table
    y['ack'] = req.body.ack
    y['noOfStars'] = req.body.stars
    y['noOfReads'] = 0
    y['chapters'] = [
        // {chapter1:req.body.chapter1},
        // {chapter2:req.body.chapter2},
        // {chapter3:req.body.chapter3},
        // {chapter4:req.body.chapter4},
        // {chapter5:req.body.chapter5},
        // {chapter6:req.body.chapter6},
    ]
    y['genres'] = req.body.genres
    y['price'] = req.body.price
    y['bookId'] = req.body.id
    y['dateCreated'] = new Date()
    y['bookArtSm'] = req.body.bookCovaSm

    try {
        let s = await y.save()
        res.json({ code: 1, msg: "successfully uploaded book" })
    } catch (e) {
        console.log(e)
        res.json({ code: 0, msg: 'error: ' + e })
    }
}).post('/apiTuto/admin/addChapter', async (req, res) => {
    let y = await book.findOne({ bookId: req.body.id })
    y['chapters'].push({ 'chapter': req.body.chp })
    y.save()
    res.json({ code: 1, msg: 'successfully added chapter' })
})
mstr.get('/apiTuto/increNoReads', async (req, res) => {
    try {
        let y = await book.findOne({ bookId: req.query.bookId })
        let id = req.query.bookId
                let u = await tutoUser.findOne({ account_no: req.query.user })
        if (!u['favAut'].includes(y['author'])) {
            u['favAut'].push(y['author'])
        }
        if (!u['listOfBooksReadingByCoins'].includes(req.query.bookId)) {
            u['listOfBooksReadingByCoins'].push(id)
        }
        u.save()
        y['noOfReads'] = parseInt(y['noOfReads']) + 1
        y.save()
        res.json({ code: 1 })
        trnd()
    } catch (e) {
        console.log('err: ' + e)
    }

}).get('/apiTuto/increBookAcq',async(req,res)=>{
    // find user
    let u = await tutoUser.findOne({account_no:req.query.user})
    // loop over user's 'listOfBooksReadingByCoins'
    for (let index = 0; index < u['clt'].length; index++) {
        // check for bookId in each element of arr of type object 
        if(req.query.bookId in u['clt'][index]){
            // increase count by one
            u['clt'][index][req.query.bookId] = parseInt(u['clt'][index][req.query.bookId]) + 1
        }        
    }  
    u.save()
    res.send({code:1})
    
}).get('/apiTuto/chkBkCrnRead',async(req,res)=>{
    let u = await tutoUser.findOne({account_no:req.query.user})
    let yi = JSON.parse(u['clt'])
    if(u['clt'] == null || undefined){

         res.json({code:1})
     }
            else if(req.query.bookId in yi){
                // increase count by one
            res.json({code:1,msg:'avail',kile:yi[req.query.bookId]})
            }else{
                res.json({code:1})

        }
    
}).get('/apiTuto/rmvCoin',async(req,res)=>{
    let bk = await book.findOne({bookId:req.query.bookId})
    let u = await tutoUser.findOne({account_no:req.query.user})
    let yi = {}
    // console.log(parseInt(u.coins) > parseInt(bk.price))
    if(parseInt(u.coins) > parseInt(bk.price)){
        u.coins = parseInt(u.coins) - parseInt(bk.price)
        // check for bookId in each element of arr of type object 
        if(u['clt'] == null || undefined){
            u['clt']= JSON.stringify ({[req.query.bookId]:2})
            console.log(u['clt'])

        }
        else {

            yi = JSON.parse(u['clt'])
        
            if (req.query.bookId in yi) {
                // increase count by one
                if (parseInt(req.query.chptr) > parseInt(yi[req.query.bookId])) {
                    yi[req.query.bookId] = parseInt(yi[req.query.bookId]) + 1
                }

            } else {
                console.log(parseInt(req.query.chptr))

                yi[req.query.bookId] = 2
            }
            u['clt'] = JSON.stringify(yi)
        }

           let yu = await u.save()
            
            console.log(yu['clt'])
        yu.hash = ''
        yu.salt = ''
        res.send({code:1,msg:'done',user:yu})
        }
    else{
        res.json({code:1,msg:'insufficient'})
    }


}).get('/apiTuto/search',async(req,res)=>{
    try{

        res.json({code:1,msg: await book.find({title:req.query.item})})
    }
    catch(e){
        res.json({code:0,msg:'err: '+e})
    }
}).get('/apiTuto/trxHis',async(req,res)=>{
    try{
        if(req.query.admin){
            res.json({code:1,msg: await trxHis.find()})
        }else{
            res.json({code:1,msg: await trxHis.find({userId:req.query.user})})
        }
    }catch(e){
        res.json({code:0,msg:'error: '+e})
        
    }
}).get('/apiTuto/admin/cmpltBk',async(req,res)=>{
    let bk = await book.findOne({bookId:req.query.bookId})
    bk['done'] = true
    bk.save()
    res.json({code:1,msg:'successfully ended'})
}).delete('/apiTuto/admin/delBk',async(req,res)=>{
    let kj = await book.deleteOne({bookId:req.query.bookId})
    console.log(kj)
    res.json({code:1,msg:'deleted'})
})
let trendArr = []
let trendArrF = []
let arrTre = []
async function trnd() {
    let bks = await book.find()
    let usrs = await tutoUser.find()
    let bksArr = []
    let usrsArr = []
    for (let index = 0; index < bks.length; index++) {
        bksArr.push(bks[index]['bookId']);
    }
    for (let indexx = 0; indexx < usrs.length; indexx++) {
        if(usrs[indexx]['listOfBooksReadingByCoins'].length > 0){
            usrsArr.push(usrs[indexx]['listOfBooksReadingByCoins']);
        }
    }
    let bkFrq = 0
    let j = ''
    let yp = []
    let p = {}
    for (let indxx = 0; indxx < bksArr.length; indxx++) {
        // loop over the array of users currently read books
        for (let indx = 0; indx < usrsArr.length; indx++) {
            if (usrsArr[indx].includes(bksArr[indxx])) {
                bkFrq++
            }
            }
            
            // console.log(bkFrq + "mlml")
            // console.log(usrsArr[indx])
            // j = bksArr[indxx]
            // console.log(j)
            
           p[bkFrq]=bksArr[indxx]
            // console.log(bksArr[indxx])
            // console.log(p)   
            yp.push(bkFrq)
            trendArr.push(p)
            bkFrq = 0
            p = {}
    }
    // console.log(trendArr)
    // console.log(yp)
    // Rank Here
    let arrTree = yp.sort(function (a, b) { return parseInt(b) - parseInt(a) })
   
    for(let jd = 0; jd < arrTree.length;jd++ ){
        for (let il = 0; il < trendArr.length; il++) {
            // const element = trendArr[il];
            if(arrTree[jd] in trendArr[il]){
                trendArrF.push(await book.findOne({bookId:trendArr[il][arrTree[jd]]}))
            }
            
        }
    }
    // console.log(arrTree)
    // ranktrnd()
}
trnd()
let ranktrnd = () => {
    let arr = []
    for (let index = 0; index < trendArr.length; index++) {
        arr.push((Object.keys(trendArr[index]))[0])
    }
    let arrTree = arr.sort(function (a, b) { return parseInt(a) - parseInt(b) })
    for (let inde = 0; inde < arrTree.length; inde++) {
        for (let ing = 0; ing < trendArr.length; ing++) {
            if (arrTree[inde].toString() in trendArr[ing]) {
                trendArrF.push(trendArr[ing])
            }
        }
    }
}

mstr.post('/nataReg', async (req, res) => {
    try {
        let y = await nataSch.registerNata(req.body)
        res.json({ code: 1, msg: y })

    } catch (e) {
        res.json({ code: 0, msg: e })

    }
}).post('/nataUploadFunds', async (req, res) => {
    try {
        res.json({ code: 1, msg: await nataSch.uploadFunds(req.body.id, req.body.amt) })
    } catch (e) {
        res.json({ code: 0, msg: e })
    }
})
mstr.get('/nataNameQry', async (req, res) => {
    console.log(req.query)
    if (req.query.acctNo != '0037514056') {
        res.json({ code: 0, msg: 'use the sandbox provided account number which is 0037514056' })
    } else {
        try {
            res.json({ code: 1, msg: await nataSch.nameQry() })
        } catch (e) {
            res.json({ code: 0, msg: e })
        }
    }
}).get('/getBizMoney/:id', async (req, res) => {
    res.json(await nataSch.getBizMon(req.params.id))
})
module.exports = mstr;