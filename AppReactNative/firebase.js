// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKaeI2FNZvcxepWo3LV0lnB3pVAeEBlHw",
  authDomain: "smart-home-8fedd.firebaseapp.com",
  databaseURL: "https://smart-home-8fedd-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-home-8fedd",
  storageBucket: "smart-home-8fedd.firebasestorage.app",
  messagingSenderId: "848175227650",
  appId: "1:848175227650:web:a0d590f466a9dcc963981b",
  measurementId: "G-8PQZK2GC42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);