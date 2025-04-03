import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB5pnWSEMFQwha35KLGWmTFWwDOTP4ssKI",
  authDomain: "plantcareassistant-4a1c8.firebaseapp.com",
  projectId: "plantcareassistant-4a1c8",
  storageBucket: "plantcareassistant-4a1c8.firebasestorage.app",
  messagingSenderId: "1038325753437",
  appId: "1:1038325753437:web:abfc1234b9b9fadb9a8fb4",
  measurementId: "G-8WVCRZX5DR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

