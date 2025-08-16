const publicRoutes = ["/login", "/signup", "public", "/"];
export default defineNuxtRouteMiddleware((to) => {
  if (publicRoutes.some((route) => to.path.startsWith(route))) {
    return;
  }

  const unauthenticatedRoutes = ["/public", "/auth/google"];
  if (unauthenticatedRoutes.some((route) => to.path.startsWith(route))) {
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
