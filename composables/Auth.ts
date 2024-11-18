import {
  GoogleAuthProvider,
  getAuth,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { doc, Firestore, setDoc } from "firebase/firestore";

export const useAuth = (db: Firestore) => {
  const snackbarStore = useSnackbar();

  const isSignedIn = () => {
    return !!getAuth().currentUser;
  };
  const userRef = useState<{
    id: string;
    displayName: string | null;
    email: string | null;
    hasPhoto: boolean;
  } | null>("authUser", () => null);
  const redirectPath = useState<string | null>("redirectPath", () => null);

  const updateUser = async (user: {
    uid: string;
    displayName: string | null;
    email: string | null;
  }) => {
    if (!user) {
      console.error("No user for onAuthStateChanged");
      snackbarStore.enqueue("No user", "error");
      return;
    }
    const success = await createUserIfNotExists({
      id: user.uid,
      displayName: user.displayName,
      email: user.email,
    });
    if (!success) {
      console.error("Failed to create user");
      return;
    }
    console.log("User signed in:", user);
    const { displayName, email, uid } = user;
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
    signInWithRedirect(getAuth(), provider);
  };

  const signOutInternal = () => {
    signOut(getAuth())
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
    redirectPath,
    updateUser,
  };
};
