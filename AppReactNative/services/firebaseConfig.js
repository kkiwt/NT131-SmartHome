import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// config của bạn
const firebaseConfig = {
  apiKey: "AIzaSyAKaeI2FNZvcxepWo3LV0lnB3pVAeEBlHw",
  authDomain: "smart-home-8fedd.firebaseapp.com",
  databaseURL: "https://smart-home-8fedd-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-home-8fedd",
  storageBucket: "smart-home-8fedd.firebasestorage.app",
  messagingSenderId: "848175227650",
  appId: "1:848175227650:web:a0d590f466a9dcc963981b",
};

// init
const app = initializeApp(firebaseConfig);

// export auth để dùng
export const auth = getAuth(app);