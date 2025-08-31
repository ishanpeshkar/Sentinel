const admin = require('firebase-admin');

// IMPORTANT: The path to this file should be relative to where your app is started.
// We will start our app from the root of the 'backend' folder.
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

console.log("Firebase connected successfully.");

module.exports = { db };