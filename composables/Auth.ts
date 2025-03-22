// https://github.com/nuxt/nuxt/issues/14508

export const useAuth = () => {
  const { loggedIn, user, fetch: refreshSession, clear } = useUserSession();
  const snackbarStore = useSnackbar();

  const loading = useState<boolean>("loadingUser", () => true);
  const prevLink = useState<string | null>("prevLink", () => null);

  const { data: userData, error: userError } = useFetch("/api/private/users", {
    method: "get",
    watch: [loggedIn],
  });

  const signup = async (name: string, email: string, password: string) => {
    try {
      await $fetch("api/signup", {
        method: "POST",
        body: { email, password, name },
      });
      snackbarStore.enqueue("Signed up successfully", "success");
      await refreshSession();
      const prevLinkValue = prevLink.value;
      if (prevLinkValue) {
        navigateTo(prevLinkValue);
      } else {
        navigateTo("/");
      }
    } catch {
      snackbarStore.enqueue("Failed to sign up", "error");
      return false;
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      await $fetch("/api/login", {
        method: "POST",
        body: credentials,
      });
      // Refresh the session on client-side and redirect to the home page
      await refreshSession();
      snackbarStore.enqueue("Logged in successfully", "success");
      const prevLinkValue = prevLink.value;
      if (prevLinkValue) {
        navigateTo(prevLinkValue);
      } else {
        navigateTo("/");
      }
    } catch (e) {
      snackbarStore.enqueue("Bad credentials", "error");
      console.error("Login failed", e);
    }
  };

  const signInWithGoogle = async () => {
    console.error("not implemented");
  };

  const signOut = () => {};

  return {
    signInWithGoogle,
    signOut,
    user: computed(() => user.value),
    signup,
    loading,
    loggedIn: computed(() => loggedIn.value),
    login,
    refreshSession,
    prevLink: computed(() => prevLink.value),
    setPrevLink: (link: string) => {
      prevLink.value = link;
    },
    dbUser: computed(() => userData.value?.body || null),
  };
};
