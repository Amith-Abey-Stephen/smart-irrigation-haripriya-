import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlY9sDkxk7rv8fc4GKGrrlaMs8NQFw6a0",
  authDomain: "smartirrigation-73136.firebaseapp.com",
  projectId: "smartirrigation-73136",
  storageBucket: "smartirrigation-73136.firebasestorage.app",
  messagingSenderId: "188244407607",
  appId: "1:188244407607:web:e6899e2ef8af89eb2056b2",
  measurementId: "G-H5JBEGV2LS"
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const auth = getAuth(app);

createApp(App)
  .use(router)
  .mount('#app')
