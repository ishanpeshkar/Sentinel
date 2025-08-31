// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBsf9nuHyM1x7eU_9hd01hPUwqhNtISG5Y",
  authDomain: "sentinel-97ef1.firebaseapp.com",
  projectId: "sentinel-97ef1",
  storageBucket: "sentinel-97ef1.firebasestorage.app",
  messagingSenderId: "464079184725",
  appId: "1:464079184725:web:dd7636ca26cda66a6845dc",
  measurementId: "G-6E462BQNLR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
