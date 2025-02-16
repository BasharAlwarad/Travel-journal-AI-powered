import { config } from 'dotenv';
config();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGODB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const CLIENT_URL = process.env.CLIENT_URL;
const storageBucket = process.env.FIREBASE_SERVICE_BUCKET_NAME;
const apiKey = process.env.OPEN_AI_APIKEY;
const mode = process.env.AI_MODE;
const stream = process.env.AI_STREAM === 'false' ? false : true;

const firebaseServiceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

export {
  PORT,
  MONGO_URI,
  SESSION_SECRET,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  CLIENT_URL,
  storageBucket,
  apiKey,
  mode,
  stream,
  firebaseServiceAccount,
};
