// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "brigthest-89250.firebaseapp.com",
  projectId: "brigthest-89250",
  storageBucket: "brigthest-89250.appspot.com",
  messagingSenderId: "1050977253807",
  appId: "1:1050977253807:web:e773f9eaae883c948e975a",
  measurementId: "G-VG1G63XSQL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);