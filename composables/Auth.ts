// https://github.com/nuxt/nuxt/issues/14508

export const useAuth = () => {
  const { loggedIn, user, fetch: refreshSession, clear } = useUserSession();
  const snackbarStore = useSnackbar();

  const loading = useState<boolean>("loadingUser", () => true);
  const prevLink = useState<string | null>("prevLink", () => null);

  watch(
    loggedIn,
    (newValue) => {
      console.log("loggedIn changed", newValue);
    },
    { immediate: true },
  );

  watch(
    user,
    (newValue) => {
      console.log("user changed", newValue);
      loading.value = false;
    },
    { immediate: true },
  );

  const { data: userData, error: userError } = useFetch("/api/private/users", {
    method: "get",
    watch: [loggedIn],
  });

  watch(
    userData,
    (newValue) => {
      console.log("userData changed", newValue);
      loading.value = false;
    },
    { immediate: true },
  );

  watch(
    userError,
    (newValue) => {
      if (newValue) {
        console.error("Error fetching user data", newValue);
        snackbarStore.enqueue("Failed to fetch user data", "error");
      }
    },
    { immediate: true },
  );

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
        await navigateTo(prevLinkValue);
        return;
      }
      await navigateTo("/");
    } catch (e) {
      console.error("Signup failed", e);
      snackbarStore.enqueue("Failed to sign up", "error");
      return false;
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    $fetch("/api/login", {
      method: "POST",
      body: credentials,
    })
      .then(async () => {
        console.log("Login successful, refreshing session");
        await refreshSession();
        console.log("Session refreshed");
        snackbarStore.enqueue("Logged in successfully", "success");
        const prevLinkValue = prevLink.value;
        if (prevLinkValue) {
          console.log("Navigating to prevLink", prevLinkValue);
          await navigateTo(prevLinkValue);
          return;
        }
        console.log("Navigating to home page");
        await navigateTo("/");
      })
      .catch((e) => {
        snackbarStore.enqueue("Login failed", "error");
        console.error("Login failed", e);
      });
  };

  const signInWithGoogle = async () => {
    console.error("not implemented");
  };

  const signOut = () => {
    clear();
    snackbarStore.enqueue("Logged out successfully", "info");
    return navigateTo("/login");
  };

  console.log("setup completed");

  return {
    signInWithGoogle,
    signOut,
    user,
    signup,
    loading,
    loggedIn,
    login,
    refreshSession,
    prevLink: computed(() => prevLink.value),
    setPrevLink: (link: string) => {
      prevLink.value = link;
    },
    dbUser: computed(() => userData.value?.body || null),
    userError,
  };
};
