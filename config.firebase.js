const firebase = require('firebase/app');
const { initializeApp } = require('firebase/app');

const {
  getStorage,
  ref,
  getDownloadURL,
  getMetadata,
  deleteObject,
} = require('firebase/storage');
const {
  APIKEY_FIREBASE,
  AUTHDOMAIN_FIREBASE,
  PROJECTID_FIREBASE,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  MEASUREMENTID,
} = process.env;

const firebaseConfig = {
  apiKey: APIKEY_FIREBASE,
  authDomain: AUTHDOMAIN_FIREBASE,
  projectId: PROJECTID_FIREBASE,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENTID,
};

const app = initializeApp(firebaseConfig);

const storage = getStorage();
module.exports = {
  app,
  storage,
  getDownloadURL,
  uploadBytes,
  getMetadata,
  ref,
  deleteObject,
};
