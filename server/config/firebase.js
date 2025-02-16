import admin from 'firebase-admin';
import { storageBucket, firebaseServiceAccount } from './config.js';

admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount),
  storageBucket,
});

export const bucket = admin.storage().bucket();
