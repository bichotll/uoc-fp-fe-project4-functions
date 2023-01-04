import * as functions from "firebase-functions";

import * as admin from "firebase-admin";
admin.initializeApp();


const sendNotification = async (msg: string) => {

    functions.logger.log(msg);

    // Notification details.
    const payload = {
        notification: {
            title: msg,
            // body: text ? (text.length <= 100 ? text : text.substring(0, 97) + '...') : '',
            // icon: snapshot.data().profilePicUrl || '/images/profile_placeholder.png',
            // click_action: `https://${process.env.GCLOUD_PROJECT}.firebaseapp.com`,
        }
    };

    // Get the list of device tokens.
    const allTokens = await admin.firestore().collection('tokens').get();
    const tokens: any = [];
    allTokens.forEach((tokenDoc) => {
        tokens.push(tokenDoc.data().tokenId);
    });
    functions.logger.log('tokens length: ', tokens.length);

    if (tokens.length > 0) {
        // Send notifications to all tokens.
        await admin.messaging().sendToDevice(tokens, payload);
        // await cleanupTokens(response, tokens);
        functions.logger.log('Notifications have been sent and tokens cleaned up.');
    }
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
