// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAlY9sDkxk7rv8fc4GKGrrlaMs8NQFw6a0",
  authDomain: "smartirrigation-73136.firebaseapp.com",
  projectId: "smartirrigation-73136",
  storageBucket: "smartirrigation-73136.firebasestorage.app",
  messagingSenderId: "188244407607",
  appId: "1:188244407607:web:e6899e2ef8af89eb2056b2",
  measurementId: "G-H5JBEGV2LS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
