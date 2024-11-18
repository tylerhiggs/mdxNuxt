import {
  getAuth,
  inMemoryPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithRedirect,
} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { getFirestore } from "firebase/firestore";
import { useAuth } from "~/composables/Auth";
import { app } from "~/firebase/frontendFirebase";

const db = getFirestore(app);

onAuthStateChanged(getAuth(), async (user) => {
  const store = useAuth(db);
  const snackbarStore = useSnackbar();
  if (!user) {
    console.error("No user for getRedirectResult");
    snackbarStore.enqueue("No user for redirect", "error");
    return;
  }
  store.updateUser(user);
});

setPersistence(getAuth(), inMemoryPersistence)
  .then(() => {
    const provider = new GoogleAuthProvider();
    // In memory persistence will be applied to the signed in Google user
    // even though the persistence was set to 'none' and a page redirect
    // occurred.
    return signInWithRedirect(getAuth(), provider);
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error:", errorCode, errorMessage);
  });

export default defineNuxtRouteMiddleware((to, _from) => {
  if (to.path.startsWith("/public")) {
    return navigateTo(to.path);
  }
  const authStore = useAuth(db);

  if (!authStore.isSignedIn()) {
    return navigateTo("/login");
  }
});
