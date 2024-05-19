const {sendNotification} = require('./notify')
const tutoUser = require('./schema/tutoUser')

let users = tutoUser.find()

async function sendToAll(message){
    for (let index = 0; index < users.length; index++) {
      await sendNotification(message.title, message.body, users[index]['firebaseToken']) 
        
    }
}
module.exports = {
    sendToAll
}