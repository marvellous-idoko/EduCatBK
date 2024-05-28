// const mailjet = require('node-mailjet')
//         .connect('5ce373d7ff5e5eafb859cca5e36d9cbd', 'b832a63817de1ca41801d1c2edfcd923')


// const API_KEY = '28565528da9a491dc6232686bceb4afd-1b3a03f6-2389f66a';
// const DOMAIN = 'mg.aptmachjo.com';

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})


module.exports = {
  mailFree: async function (mailDet) {
    mailDet['from'] = process.env.EMAIL_USER;
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
