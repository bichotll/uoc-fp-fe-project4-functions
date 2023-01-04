import * as functions from "firebase-functions";

import * as admin from "firebase-admin";
admin.initializeApp();


// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const sendNotification = async (msg: string) => {

    functions.logger.log(msg);

    // Notification details.
    // const text = snapshot.data().text;
    const payload = {
        notification: {
            title: msg,
            // body: text ? (text.length <= 100 ? text : text.substring(0, 97) + '...') : '',
            // icon: snapshot.data().profilePicUrl || '/images/profile_placeholder.png',
            // click_action: `https://${process.env.GCLOUD_PROJECT}.firebaseapp.com`,
        }
    };

    return await admin.messaging().sendToDevice([
        'epWHn-74ZELV9qJdKKUayA:APA91bGTT3UxdNXPnhdN8Sf-dJmISBKUtbKuuto_vKzW7glqKjlM9J-E0vYH7EfygfvJE3AvWB4HBvJo7QmK6rNOdeA4o7nT2cVFAUUn4VigmLYCHzta6Lhr3XGUKWWkVBncSEVJvUCS'
    ], payload);

    // // Get the list of device tokens.
    // const allTokens = await admin.firestore().collection('fcmTokens').get();
    // const tokens = [];
    // allTokens.forEach((tokenDoc) => {
    //     tokens.push(tokenDoc.id);
    // });

    // if (tokens.length > 0) {
    //     // Send notifications to all tokens.
    //     const response = await admin.messaging().sendToDevice(tokens, payload);
    //     await cleanupTokens(response, tokens);
    //     functions.logger.log('Notifications have been sent and tokens cleaned up.');
    // }
}

exports.sendNotificationsOnDocumentCreate = functions.firestore.document('Jugadores/{messageId}').onCreate(
    async (snapshot) => {
        return sendNotification(`jugador ${snapshot.data().nombre} creado`);
    }
);

exports.sendNotificationsOnDocumentUpdate = functions.firestore.document('Jugadores/{messageId}').onUpdate(
    async (snapshot) => {
        return sendNotification(`jugador ${snapshot.after.data().nombre} actualizado`);
    }
);

exports.sendNotificationsOnDocumentUpdate = functions.firestore.document('Jugadores/{messageId}').onDelete(
    async (snapshot) => {
        return sendNotification(`jugador ${snapshot.data().nombre} actualizado`);
    }
);
