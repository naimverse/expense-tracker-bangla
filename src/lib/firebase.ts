import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0Js4KipaSEZENzmR4jG38XzTtAAuVZcA",
  authDomain: "my-portfolio-e17ab.firebaseapp.com",
  projectId: "my-portfolio-e17ab",
  storageBucket: "my-portfolio-e17ab.firebasestorage.app",
  messagingSenderId: "312777209379",
  appId: "1:312777209379:web:a2ca474e346e523417a396",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
