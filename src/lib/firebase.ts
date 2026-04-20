import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCdjlonvk6LYd4NDr2o3fTYY_LEDHJtmAs",
  authDomain: "bazarkhoroch-af91f.firebaseapp.com",
  projectId: "bazarkhoroch-af91f",
  storageBucket: "bazarkhoroch-af91f.firebasestorage.app",
  messagingSenderId: "75560512480",
  appId: "1:75560512480:web:81ad8f7f5e7f9379f65985",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
