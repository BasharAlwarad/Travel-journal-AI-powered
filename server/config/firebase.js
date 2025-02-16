import admin from 'firebase-admin';

import { firebaseServiceAccount, storageBucket } from '../config/config.js';
admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount),
  storageBucket,
});

export const bucket = admin.storage().bucket();
