const publicRoutes = ["/login", "/signup", "public"];
export default defineNuxtRouteMiddleware((to, from) => {
  console.log("Middleware: auth", to.path);
  if (publicRoutes.some((route) => to.path.startsWith(route))) {
    console.log("Public route, no auth needed");
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
});
