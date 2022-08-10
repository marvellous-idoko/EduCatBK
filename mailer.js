// const mailjet = require('node-mailjet')
//         .connect('5ce373d7ff5e5eafb859cca5e36d9cbd', 'b832a63817de1ca41801d1c2edfcd923')


// const API_KEY = '28565528da9a491dc6232686bceb4afd-1b3a03f6-2389f66a';
// const DOMAIN = 'mg.aptmachjo.com';

const nodemailer = require("nodemailer");
// var smtpTransport = require('nodemailer-smtp-transport');

// const formData = require('form-data');
// const Mailgun = require('mailgun.js');

// const req = require('request')
// const util = require('util');
// const request = util.promisify(req);
// const mailgun = new Mailgun(formData);
// const client = mailgun.client({ username: 'api', key: API_KEY });


// async..await is not allowed in global scope, must use a wrapper
// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing


//  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
const transporter = nodemailer.createTransport({
  service: "Hotmail",
  auth: {
      user: "aptmachjo@outlook.com",
      pass: "ALs)JDV$h/M2^WV"
  }
});

// const SibApiV3Sdk = require('sib-api-v3-sdk');
// let defaultClient = SibApiV3Sdk.ApiClient.instance;

// let apiKey = defaultClient.authentications['api-key'];
// apiKey.apiKey = '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';

// let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

// sendSmtpEmail.subject = "My {{params.subject}}";
// sendSmtpEmail.htmlContent = "<html><body><h1>This is my first transactional email {{params.parameter}}</h1></body></html>";
// sendSmtpEmail.sender = {"name":"John Doe","email":"idokomarvelous@gmail.com"};
// sendSmtpEmail.to = [{"email":"infiniteflow.llp@gmail.com","name":"Jane Doe"}];
// sendSmtpEmail.headers = {"Some-Custom-Name":"unique-id-1234"};
// sendSmtpEmail.params = {"parameter":"My param value","subject":"New Subject"};

// apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
//   console.log('API called successfully. Returned data: ' + JSON.stringify(data));
// }, function(error) {
//   console.error(error);
// });

let options = {
  'method': 'POST',
  'url': 'https://api.sendinblue.com/v3/smtp/email',
  'headers': {
    'accept': ' application/json',
    // 'api-key':"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",
    'api-key': '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',
    'content-type': 'application/json'
  },

  'data': JSON.stringify( {
    "sender": {
      "name": "Sender Alex",
      "email": "idokomarvelous@gmail.com"
    },
    "to": [
      {
        "email": "infiniteflow.llp@gmail.com",
        "name": "John Doe"
      }
    ],
    "subject": "Hello world",
    "htmlContent": "<html><head></head><body><p>Hello,</p>This is my first transactional email sent from Sendinblue.</p></body></html>"
  }),
  'body': JSON.stringify({
    "sender": {
      "name": "Sender Alex",
      "email": "idokomarvelous@gmail.com"
    },
    "to": [
      {
        "email": "infiniteflow.llp@gmail.com",
        "name": "John Doe"
      }
    ],
    "subject": "Hello world",
    "htmlContent": "<html><head></head><body><p>Hello,</p>This is my first transactional email sent from Sendinblue.</p></body></html>"
  })
}

module.exports = {
  // mailNow: function (data) {
  //   client.messages.create(DOMAIN, data)
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });

  // },
  // mailNoww: function (email, fullName, msg) {
  //   console.log('called . . .')
  //   const request = mailjet
  //     .post("send", { 'version': 'v3.1' })
  //     .request({
  //       "Messages": [
  //         {
  //           "From": {
  //             "Email": "santsikudi@gmail.com",
  //             "Name": "Educat"
  //           },
  //           "To": [
  //             {
  //               "Email": email,
  //               "Name": fullName
  //             }
  //           ],
  //           "Subject": "Notification EduCat",
  //           "TextPart": msg,
  //           "HTMLPart": `<p>${msg}</>`,
  //           "CustomID": "AppGettingStartedTest"
  //         }
  //       ]
  //     })
  //   request
  //     .then((result) => {
  //       console.log(result.body)
  //     })
  //     .catch((err) => {
  //       console.log(err.statusCode)
  //     })
  // },
  mailFree: async function (mailDet) {

    transporter.sendMail(mailDet,  function(error, info){
      if(error) {
        console.log(error);
      }else{
        console.log('Message sent: ');
        console.log( info)
      }
    });
  }

}
