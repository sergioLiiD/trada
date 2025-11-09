import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDj9amBZsMkLeDIIWqUXhc19uwrxzhWGrg",
  authDomain: "trada-1992a.firebaseapp.com",
  projectId: "trada-1992a",
  storageBucket: "trada-1992a.firebasestorage.app",
  messagingSenderId: "835411805747",
  appId: "1:835411805747:web:447c3f8d2ecf73f3f4c546",
  measurementId: "G-2BZQ0EBZDF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
