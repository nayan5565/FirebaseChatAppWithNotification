'use strict'

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();


exports.sendMessageNotification = functions.database.ref('/notifications/{user_id}/{notification_id}')
    .onWrite((change, context) => {
        const user_id = context.params.user_id;
        const notification_id = context.params.notification_id;
        console.log('We have');
        console.log('We have notification to send 3 : ', user_id);

     
      

        const ref = admin.database().ref(`/user/${user_id}`);
        ref.on("value", function(snapshot) {
            console.log("Step 4");
            const deviceToken = snapshot.val().deviceToken;
			 const email = snapshot.val().email;
			console.log("Step 5:"+email);
			const payload = {
                notification: {
                    title: "Friend Request",
                    body: "You have received a new Friend Request",
                    icon: "default"

                }
            };

            return admin.messaging().sendToDevice(deviceToken, payload).then(response => {
                console.log('This was the notification Feature');
                return null;
            });

        }, function(errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
        
    });