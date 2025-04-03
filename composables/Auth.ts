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
    userError,
    (newValue) => {
      if (newValue) {
        console.error("Error fetching user data", newValue);
        snackbarStore.enqueue("Failed to fetch user data", "error");
      }
    },
    { immediate: true },
  );

  const signOut = () => {
    clear();
    snackbarStore.enqueue("Logged out successfully", "info");
    return navigateTo("/login");
  };
  return {
    signOut,
    user,
    loading,
    loggedIn,
    refreshSession,
    prevLink: computed(() => prevLink.value),
    setPrevLink: (link: string) => {
      prevLink.value = link;
    },
    dbUser: computed(() => userData.value?.body || null),
    userError,
  };
};
