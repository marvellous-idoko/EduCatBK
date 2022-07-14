"use strict"
const teacher = require('./schema/teacher')
const school = require('./schema/school')
const student = require('./schema/student')
const result = require('./schema/result')

module.exports = {
    submitResult: async function (rsltBody) {
console.log(rsltBody)      
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
        // rslt.name = y.name
        try {
            rslt.save((e, r) => {
                if (e) throw new Error('database error . .  ' + e) 
                else{
                    // fr = true
                }
            })
            return true
        } catch (e) {
            return { code: 0, msg: e }
        }
    },
    getResult: async function (term,id) {
        return await result.find({term:term,stId:id})
    },
    getReslts: async function(session){
    return await result.find({term:'3rd',session:session})
    },
    checkResultBeforeSubmit: async function(details){
        return await result.find(details)
    }
}
