const publicRoutes = ["/login", "/signup", "public"];
export default defineNuxtRouteMiddleware((to, from) => {
  console.log("Middleware: auth", to.path);
  if (publicRoutes.some((route) => to.path.startsWith(route))) {
    console.log("Public route, no auth needed");
    return;
  }

  const unauthenticatedRoutes = ["/public", "/auth/google"];
  if (unauthenticatedRoutes.some((route) => to.path.startsWith(route))) {
    console.log("Unauthenticated route, no auth needed");
    return;
  }

  const { loggedIn } = useUserSession();
  const auth = useAuth();
  if (!loggedIn.value) {
    auth.setPrevLink(to.path);
    console.log(
      "User not logged in, redirecting to login, setting prevLink to ",
      to.path,
    );
    return navigateTo("/login");
  }
  if (auth.prevLink.value) {
    console.log("User logged in, redirecting to prevLink", auth.prevLink.value);
    const prevLinkValue = auth.prevLink.value;
    auth.setPrevLink("");
    return navigateTo(prevLinkValue);
  }
});
