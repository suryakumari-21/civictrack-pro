import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA7I0VzzfmOc7XGYGMItG8ehyXt31ThMS4",
  authDomain: "civictrack-pro.firebaseapp.com",
  projectId: "civictrack-pro",
  storageBucket: "civictrack-pro.firebasestorage.app",
  messagingSenderId: "546094070520",
  appId: "1:546094070520:web:a4c365db13610e84cb590d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;