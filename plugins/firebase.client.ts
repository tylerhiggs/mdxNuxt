// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/web-extension";

export default defineNuxtPlugin((nuxtApp) => {
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
  const auth = getAuth(app);
  const db = getFirestore(app);

  onAuthStateChanged(auth, async (user) => {
    const store = useAuth();
    const snackbarStore = useSnackbar();
    if (!user && !store.loading.value) {
      console.error("No user for getRedirectResult");
      snackbarStore.enqueue("No user for redirect", "error");
      return;
    }
    if (!user) {
      store.loading.value = false;
      return;
    }
    store.updateUser(user);
  });

  return {
    provide: {
      firebaseApp: app,
      db,
      auth,
      analytics,
    },
  };
});
