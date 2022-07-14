
const teacher = require('./schema/teacher')
const school = require('./schema/school')
const student = require('./schema/student')


module.exports = {
    authMail: async function (authData) {
        var acct = teacher.findOne({ email: authData.id })
        if (acct == null) {
            acct = school.findOne({ email: authData.id })
            if (acct == null) return false;
            else if (acct.pwd == authData.pwd) {
                return acct;
            } else {
                return false;
            }
        } else {
            if (acct.pwd == authData.pwd) {
                return acct;
            } else {
                return false;
            }

        }
    },

    authId: async function (authData) {
        //Student
        var acct = await student.findOne({ id: authData.id })
            // console.log(acct)
        
        if (acct == null) {
            //Teacher
            acct = await teacher.findOne({ teacherID: authData.id })
            // console.log(acct)
            if (acct == null) {
                //school
                acct = await school.findOne({ schoolId: authData.id })
                if (acct == null)
                    return false
                else if (acct.pwd == authData.pwd){
                    return acct
                }
                else
                    return false
            }

            else if (acct.pwd == authData.pwd) {
                console.log(acct)
                return acct;
            } else {
                return false;
            }
        } else {
            if (acct.pwd == authData.pwd) {
                return acct;
            } else {
                return false;
            }

        }
    }

}