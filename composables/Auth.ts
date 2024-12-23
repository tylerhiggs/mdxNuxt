import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// https://github.com/nuxt/nuxt/issues/14508

export const useAuth = () => {
  const { $db: db, $auth: auth } = useNuxtApp();
  const snackbarStore = useSnackbar();

  const isSignedIn = () => {
    return !!auth.currentUser;
  };
  const loading = useState<boolean>("loadingUser", () => true);
  const userRef = useState<{
    id: string;
    displayName: string | null;
    email: string | null;
    hasPhoto: boolean;
  } | null>("authUser", () => null);

  const updateUser = async (user: {
    uid: string;
    displayName: string | null;
    email: string | null;
  }) => {
    const success = await createUserIfNotExists({
      id: user.uid,
      displayName: user.displayName,
      email: user.email,
    });
    if (!success) {
      console.error("Failed to create user");
      loading.value = false;
      return;
    }
    console.log("User signed in:", user);
    const { displayName, email, uid } = user;
    loading.value = false;
    userRef.value = { displayName, email, id: uid, hasPhoto: false };
    snackbarStore.enqueue("Signed in", "success");
  };

  const createUserIfNotExists = async (user: {
    id: string;
    displayName: string | null;
    email: string | null;
  }) => {
    try {
      const userDoc = doc(db, "users", user.id);
      await setDoc(userDoc, user, { merge: true });
      return true;
    } catch {
      snackbarStore.enqueue("Failed to create user", "error");
      return false;
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const signOutInternal = () => {
    signOut(auth)
      .then(() => {
        console.log("Signed out");
      })
      .catch((error) => {
        console.error("Sign out error", error);
      });
  };

  return {
    signInWithGoogle,
    signOut: signOutInternal,
    isSignedIn,
    user: computed(() => userRef.value),
    updateUser,
    loading,
  };
};
