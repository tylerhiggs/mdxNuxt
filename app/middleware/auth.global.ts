const publicPrefixes = [
  "/login",
  "/signup",
  "public",
  "/public",
  "/auth/google",
];
export default defineNuxtRouteMiddleware((to) => {
  if (
    publicPrefixes.some((route) => to.path.startsWith(route)) ||
    to.path === "/"
  ) {
    return;
  }

  const { loggedIn } = useUserSession();
  const auth = useAuth();
  if (!loggedIn.value) {
    auth.setPrevLink(to.path);
    console.warn(
      "User not logged in, redirecting to login, setting prevLink to ",
      to.path,
    );
    return navigateTo("/login");
  }
  if (auth.prevLink.value) {
    const prevLinkValue = auth.prevLink.value;
    auth.setPrevLink("");
    return navigateTo(prevLinkValue);
  }
});
