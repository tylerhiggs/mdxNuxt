// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBol17TumRYj4X8E1PM2gy5czr2ZutS9sk",
  authDomain: "medotdev-aaadd.firebaseapp.com",
  projectId: "medotdev-aaadd",
  storageBucket: "medotdev-aaadd.firebasestorage.app",
  messagingSenderId: "498644002778",
  appId: "1:498644002778:web:a9ab5a0312a71d00f142e3",
  measurementId: "G-PE8LXVZZ88",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
