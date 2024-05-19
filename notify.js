const firebase = require("firebase-admin");

const serviceAccount = './assets/imgs/firebase-cert/max-75153-firebase-adminsdk-jlaq0-da213fd245.json'

function initialise() {
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://max-75153.firebaseio.com",
  });
}

async function sendNotification(title, body, firebaseToken) {
    // Create title and body according to your application logic

    // let notificationData = {
     let message = {
        notification: {
          title,
           body,
        },
        token: firebaseToken,
    //   },
    };
    let res = await firebase.messaging().send(message);
  };
  module.exports = {
    initialise,
    sendNotification
  }
