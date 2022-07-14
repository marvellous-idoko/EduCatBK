"use strict"
const teacher = require('./schema/teacher')
const school = require('./schema/school')
const student = require('./schema/student')
const result = require('./schema/result')


function m(e, r) {
    console.log(r)
    if (e) {
        console.log(e + 'mlllml')
        throw new Error('database error . .  ' + e)
    }
    else return true
}
module.exports = {
    submitResult: async function (rsltBody) {
        let y = await student.findOne({ id: rsltBody.stId })
        // console.log(rsltBody)      
        let rslt = new result()
        rslt.term = rsltBody.term
        rslt.subject = rsltBody.subject
        rslt.stId = rsltBody.stId
        rslt.testScr = rsltBody.tscr
        rslt.ExamScr = rsltBody.escr
        rslt.total = rsltBody.tot
        rslt.Grade = rsltBody.grd
        rslt.lastUpdated = new Date()
        rslt.lastUpdatedBy = rsltBody.updateBy
        rslt.schId = rsltBody.schId
        rslt.session = rsltBody.session
        rslt.published = true
        rslt.class = rsltBody.class
        rslt.subclass = rsltBody.subclass
        rslt.name = y.name
        

        try {
            var g = await rslt.save()
            if(g['published'] == true)  return true
            else throw new Error('erro')
        } catch (e) {
            console.log(e)
            return { code: 0, msg: e }
        }
    },
    getResult: async function (term, id) {
        return await result.find({ term: term, stId: id })
    },
    getReslts: async function (session) {
        return await result.find({ term: '3rd', session: session })
    },
    checkResultBeforeSubmit: async function (details) {
        return await result.find(details)
    }
}
