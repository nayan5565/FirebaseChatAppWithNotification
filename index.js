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

        const fromUser = admin.database().ref(`/notifications/${user_id}/${notification_id}`);

        fromUser.on("value", function(snapshot) {

            const from_user_id = snapshot.val().from;
            console.log('you have new freind request from : ', from_user_id);

            const userQuery = admin.database().ref(`/user/${from_user_id}/name`);
            userQuery.on("value", function(snapshot) {
                const userName = snapshot.val();
                console.log("Step 7:" + userName);
                const notificationGeting = admin.database().ref(`/user/${user_id}`);
                notificationGeting.on("value", function(snapshot) {
                    console.log("Step 4");
                    const deviceToken = snapshot.val().deviceToken;
                    const email = snapshot.val().email;
                    console.log("Step 5:" + email);
                    const payload = {
                        notification: {
                            title: "Friend Request",
                            body: `${userName} has sent you request`,
                            icon: "default",
                            click_action: "com.example.nayan.chatappupdated_TARGET_NOTIFICATION"

                        },
                        data: {
                            from_user_id: from_user_id

                        }
                    };

                    return admin.messaging().sendToDevice(deviceToken, payload).then(response => {
                        console.log('This was the notification Feature');
                        return null;
                    });

                }, function(errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });



            }, function(errorObject) {
                console.log("The read failed user: " + errorObject.code);
            });


        }, function(errorObject) {
            console.log("The read failed user: " + errorObject.code);
        });



    });