// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyBZEUiPAPpfXoqvX1j4UwC02VfLvWPSFLA",
    authDomain: "aora-72bf3.firebaseapp.com",
    projectId: "aora-72bf3",
    storageBucket: "aora-72bf3.appspot.com",
    messagingSenderId: "714987554369",
    appId: "1:714987554369:web:575994cc391643eff728c0",
    measurementId: "G-VHCZM4C9GW"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);



export { db ,auth,storage};
