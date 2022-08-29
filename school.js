'use strict'
const userNata = require('./schema/nataUser')
const crypto = require('crypto')
const req = require('request')
const util = require('util');
const request = util.promisify(req);
// var express = require("express");
// const sch = express.Router();
// const school = require('./schema/school')
// const pre = '/school/';


// sch.get('/school',(req,res)=>{
//     console.log('connected')
// })

// sch.post(pre+'CreateTeacher/',(req,res)=>{
//     var id = Math.floor(Math.random() * 1000000)
//     var sch = new school()
//     sch.dateCreated = new Date();
//     sch.email = req.body.email
//     sch.id = id;
//     try{
//     sch.save((e,r)=>{
//         if(e)throw Error('unable to create user: '+ e)
//         else{
//             console.info(r)
//         }
//     })

//     }catch(e){
//         console.info(e)
//     }
// })


function pwdHasher(pwd) {
    let salt = crypto.randomBytes(16).toString('hex');
    let hash = crypto.pbkdf2Sync(pwd, salt,
        1000, 64, `sha512`).toString(`hex`);
    return { hash: hash, salt: salt }
}
function tokenizer() {
    var options = {
        'method': 'POST',
        'url': 'https://developer.ecobank.com/corporateapi/user/token',
        'headers': {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': 'developer.ecobank.com',
            'Sandbox-Key': '4NN3rMeZHKPw8j4K32PxQ74nq0hCXIWZ1635258124',
        },
        body: '{ "userId": "iamaunifieddev103",  "password": "$2a$10$Wmame.Lh1FJDCB4JJIxtx.3SZT0dP2XlQWgj9Q5UAGcDLpB0yRYCC"}'
    };
    return request(options)
}
function upFundsProgress(token = 0) {
    //     var options = {
    //         'method': 'POST',
    //         'url': 'https://developer.ecobank.com/corporateapi/merchant/card',
    //         'headers': {
    //           'Authorization': token,
    //           'Content-Type': 'application/json',
    //           'Accept': 'application/json',
    //           'Origin': 'developer.ecobank.com'
    //         },
    //         body: JSON.stringify({
    //           "paymentDetails": {
    //             "requestId": "4466",
    //             "productCode": "GMT112",
    //             "amount": "50035",
    //             "currency": "GBP",
    //             "locale": "en_AU",
    //             "orderInfo": "255s353",
    //             "returnUrl": "https://unifiedcallbacks.com/corporateclbkservice/callback/qr"
    //           },
    //           "merchantDetails": {
    //             "accessCode": "79742570",
    //             "merchantID": "ETZ001",
    //             "secureSecret": "sdsffd"
    //           },
    //           "secureHash": "7f137705f4caa39dd691e771403430dd23d27aa53cefcb97217927312e77847bca6b8764f487ce5d1f6520fd7227e4d4c470c5d1e7455822c8ee95b10a0e9855"

    //         //   "secureHash": "85dc50e24f6f36850f48390be3516c518acdc427c5c5113334c1c3f0ba122cdd37b06a10b82f7ddcbdade8d8ab92165e25ea4566f6f8a7e50f3c9609d8ececa4"
    //         })

    // }


    var options = {
        'method': 'POST',
        'url': 'https://fsi.ng/api/v1/fcmb/payments/b2b/transfers',
        'headers': {
          'x-ibm-client-id': 'f',
          'Sandbox-Key': '4NN3rMeZHKPw8j4K32PxQ74nq0hCXIWZ1635258124',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          "nameEnquiryRef": "999214190218121217000001177403",
          "destinationInstitutionCode": "999063",
          "channelCode": "2",
          "beneficiaryAccountNumber": "0000000000",
          "beneficiaryAccountName": "OBIOHA O. GODDY",
          "beneficiaryBankVerificationNumber": "1",
          "beneficiaryKYCLevel": "3",
          "originatorAccountName": "OKUBOTE IDOWU OLUWAKEMI",
          "originatorAccountNumber": "0000000002",
          "transactionNarration": "Transfer ifo OKUBOTE",
          "paymentReference": "12345",
          "amount": "100.1",
          "traceId": "12345",
          "chargeAmount": "52.59",
          "platformType": "ESB"
        })

      };

      return request(options)

}

module.exports = {
    registerNata: async function (body) {
        let juk = pwdHasher(body['pwd'])
        let user = new userNata()
        user.name = body['name']
        user.email = body['email']
        user.contact = body['contact']
        user.address = body['address']
        user.income = body['pIncome']
        user.pwd = juk['hash']
        user.salt = juk['salt']
        try {
            return await user.save()
        } catch (e) {
            return e
        }
    },
    login: async function () {

    }, uploadFunds: async function () {
        //    let sy =  await upFundsProgress(JSON.parse((await tokenizer()).body)['token'])
        return JSON.parse(JSON.stringify(await upFundsProgress())).body
    }, nameQry: async function () {

        var options = {
            'method': 'GET',
            'url': 'https://fsi.ng/api/sterling/TransferAPIs/api/Spay/InterbankNameEnquiry?Referenceid=01&RequestType=01&Translocation=01&ToAccount=0037514056&destinationbankcode=000001',
            'headers': {
                'Sandbox-Key': '4NN3rMeZHKPw8j4K32PxQ74nq0hCXIWZ1635258124',
                'Ocp-Apim-Subscription-Key': 't',
                'Ocp-Apim-Trace': 'true',
                'Appid': '69',
                'Content-Type': 'application/json',
                'ipval': '0',
                'sandbox-key': '4NN3rMeZHKPw8j4K32PxQ74nq0hCXIWZ1635258124'
            }
        };
        return request(options)
    }
};