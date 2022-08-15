
const teacher = require('./schema/teacher')
const school = require('./schema/school')
const student = require('./schema/student')
const crypto = require('crypto')

module.exports = {
    authMail: async function (authData) {
        var acct = teacher.findOne({ email: authData.id })
        if (acct == null) {
            acct = school.findOne({ email: authData.id })
            if (acct == null) { return false }
            else {

                let hash = crypto.pbkdf2Sync(authData.pwd,
                    acct.salt, 1000, 64, `sha512`).toString(`hex`);

                if (acct.pwd == hash) {

                    return acct;
                } else {
                    return false;
                }
            }

        } else {

            let hash = crypto.pbkdf2Sync(authData.pwd,
                acct.salt, 1000, 64, `sha512`).toString(`hex`);

            if (acct.pwd == hash) {

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
                else {
                    console.log(acct.salt)
                    let hash = crypto.pbkdf2Sync(authData.pwd,
                        acct.salt, 1000, 64, `sha512`).toString(`hex`);

                    if (acct.pwd == hash) {

                        return acct;
                    } else {
                        return false;
                    }
                }
            }
            else {

                let hash = crypto.pbkdf2Sync(authData.pwd,
                    acct.salt, 1000, 64, `sha512`).toString(`hex`);

                if (acct.pwd == hash) {

                    return acct;
                } else {
                    return false;
                }
            }
        } else {

            let hash = crypto.pbkdf2Sync(authData.pwd,
                acct.salt, 1000, 64, `sha512`).toString(`hex`);

            if (acct.pwd == hash) {

                return acct;
            } else {
                return false;
            }
        }
    }
}

