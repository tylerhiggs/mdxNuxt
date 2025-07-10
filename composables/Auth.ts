// https://github.com/nuxt/nuxt/issues/14508

export const useAuth = () => {
  const { loggedIn, user, fetch: refreshSession, clear } = useUserSession();
  const snackbarStore = useSnackbar();

  const loading = useState<boolean>("loadingUser", () => true);
  const prevLink = useState<string | null>("prevLink", () => null);

  const {
    data: userData,
    error: userError,
    refresh: refetchUser,
  } = useFetch("/api/private/users", {
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

  const updateName = async (name: string) => {
    if (!userData.value?.body?.id) return;

    try {
      await $fetch(`/api/private/users/${userData.value.body.id}`, {
        method: "patch",
        body: { name },
      });
      snackbarStore.enqueue("User's name updated successfully", "success");
    } catch (error) {
      console.error("Failed to update user:", error);
    } finally {
      await refetchUser();
    }
  };

  const refetchAvatar = () => {
    if (!userData.value?.body?.avatar) {
      console.warn("No avatar to refetch");
      return;
    }
    const baseAvatarPath = userData.value.body.avatar.split("?")[0];
    const cacheKey = Date.now();
    userData.value.body.avatar = `${baseAvatarPath}?cache=${cacheKey}`;
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
    updateName,
    refetchAvatar,
  };
};
