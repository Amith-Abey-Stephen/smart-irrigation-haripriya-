// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCD6sJ7FZjdvlrrazSDLTc5KnEYaYAX-xE",
  authDomain: "si-system-e057c.firebaseapp.com",
  projectId: "si-system-e057c",
  storageBucket: "si-system-e057c.firebasestorage.app",
  messagingSenderId: "1005491550471",
  appId: "1:1005491550471:web:5bde51012697b9d1b4ada2",
  measurementId: "G-LZPYBK87SE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
