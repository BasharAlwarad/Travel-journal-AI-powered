import admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import { firebaseServiceAccount, storageBucket } from './config.js';

admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount),
  storageBucket,
});

const bucket = getStorage().bucket();
export { bucket };
