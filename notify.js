const firebase = require("firebase-admin");

function initialise() {
  firebase.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://max-75153.firebaseio.com",
  });
}

async function sendNotification(title, body, ) {
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
