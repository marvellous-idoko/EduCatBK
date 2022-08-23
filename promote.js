const Result = require('./schema/result')
const Student = require('./schema/student')

function tet(result) {
    r
}

module.exports = {
    //  after each promotion, add that session to promoted array for the sch
    calccForSingleStdnt: async function (stId, session, term = "3rd") {
        let rslt = await Result.find({ stId: stId, session: session, term: term })
        let stdntTotal = 0.00
        for (let index = 0; index < rslt.length; index++) {
            stdntTotal = stdntTotal + parseFloat(rslt[index]['total']);
        }

        return (stdntTotal / (rslt.length * 100)) * 100

    },
    promoteStdnt: async function (stId) {
        console.log(stId)
        let stdnt = await Student.findOne({ id: stId })
        if (parseInt(stdnt.class) >= 6) {
            return;
        } else {
            stdnt.class = parseInt(stdnt.class) + 1
            try {
                let y = await stdnt.save()
                return y.class;
            } catch (e) {
                return { code: 0, msg: e }
            }
        }
    }

}