"use strict"
const teacher = require('./schema/teacher')
const school = require('./schema/school')
const student = require('./schema/student')
const result = require('./schema/result')


function m(e, r) {
    if (e) {
        console.log(e + 'mlllml')
        throw new Error('database error . .  ' + e)
    }else{
    console.log(r)
    }
    // else return true
}
async function calculateAvg(params) {
    let totSc = 0
    try{
        let gy = await result.find({session:params.session,term:params.term,stId:params.stId})
        for (let index = 0; index < gy.length; index++) {
            const element = gy[index];
            totSc = parseInt(element.total) + totSc
        }
        let oi = await student.findOne({id:params.stId}) 
        oi.avg = totSc/gy.length
        
         oi.save((e, r) => {
            if (e) throw new Error('database error . .  ' + e)
            else {
                console.log(r['avg'])
                // res.json({ code: 1, msg: ''})
            }
        }
        )
    }catch(e){
        console.log(e)
    }
    
}
module.exports = {
    submitResult: async function (rsltBody) {
        
        
        if(rsltBody.stId.length == 24){
            let y = await result.findById( rsltBody.stId )
            console.log(y) 
            y.testScr = rsltBody.tscr
            y.ExamScr = rsltBody.escr
            y.total = rsltBody.tot
            y.Grade = rsltBody.grd
            y.lastUpdated = new Date()
            y.lastUpdatedBy = rsltBody.updateBy
            y.session = rsltBody.session
            try {
                var g = await y.save()
                // await calculateAvg(rsltBody)
                return true
            } catch (e) {
                console.log(e)
                return { code: 0, msg: e }
            }            
        }
        else{
        let y = await student.findOne({ id: rsltBody.stId })
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
        rslt.name = y.name
        try {
            var g = await rslt.save()
            if(g['published'] == true) 
            { 
                await calculateAvg(rsltBody)
                return true
            }
            else throw new Error('erro')
        } catch (e) {
            console.log(e)
            return { code: 0, msg: e }
        }
    }
    },
    getResult: async function (term, id,session) {
        return await result.find({ term: term, stId: id,session:session })
    },
    getReslts: async function (session) {
        return await result.find({ term: '3rd', session: session })
    },
    checkResultBeforeSubmit: async function (details) {
        return await result.find(details)
    },
    classAvg: async function(pClass,subclass,schId,term,session){
        console.log(schId)
        let rslt = await result.find({class:pClass,schId:schId,term:term,subclass:subclass,session:session})
        let classTot = 0.00
        for (let index = 0; index < rslt.length; index++) {
            classTot = classTot + parseFloat( rslt[index]['total'] )            
        } 
        console.log(classTot)
        return (classTot/(100*rslt.length))*100
    },
    // positionInClass: async function(A){
    //         var len = array_length(A);
    //         var i = 1;
    //         while (i < len) {
    //             var x = A[i];
    //             var j = i - 1;
    //             while (j >= 0 && A[j] > x) {
    //                 A[j + 1] = A[j];
    //                 j = j - 1;
    //             }
    //             A[j+1] = x;
    //             i = i + 1;
    //         }

        
    // },
    calcStdntAvg: async function(stId,term,session){
        // console.log(stId,term,session)
        let rslt = await result.find({stId:stId,term:term,session:session})
        let tot = 0.00
        for (let index = 0; index < rslt.length; index++) {
            tot = tot + parseFloat( rslt[index]['total'] )            
        } 
        console.log(tot)

        return (tot/(100*rslt.length))*100
    }
}
