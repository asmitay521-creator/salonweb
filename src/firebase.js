// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwShGQ6AGQFl1ZgB7no9drL3zSFRLL5fw",
  authDomain: "salonwebsite-1df9e.firebaseapp.com",
  projectId: "salonwebsite-1df9e",
  storageBucket: "salonwebsite-1df9e.firebasestorage.app",
  messagingSenderId: "889028104658",
  appId: "1:889028104658:web:2165d57bae391912fff80b",
  measurementId: "G-5D5YPZCXXL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Safe Analytics initialization for browser environments
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export default app;
