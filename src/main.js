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
  apiKey: "AIzaSyCD6sJ7FZjdvlrrazSDLTc5KnEYaYAX-xE",
  authDomain: "si-system-e057c.firebaseapp.com",
  projectId: "si-system-e057c",
  storageBucket: "si-system-e057c.firebasestorage.app",
  messagingSenderId: "1005491550471",
  appId: "1:1005491550471:web:5bde51012697b9d1b4ada2",
  measurementId: "G-LZPYBK87SE"
};


const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const auth = getAuth(app);

createApp(App)
  .use(router)
  .mount('#app')
