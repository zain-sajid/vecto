// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCfhD8zrsi7M4e1KgmqxCDgiULMY8oqTkc',
  authDomain: 'vecto-b9d8b.firebaseapp.com',
  projectId: 'vecto-b9d8b',
  storageBucket: 'vecto-b9d8b.appspot.com',
  messagingSenderId: '641695442637',
  appId: '1:641695442637:web:d8b2558697d9e94626eb84',
  measurementId: 'G-QKTBVJ9G1P',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);
