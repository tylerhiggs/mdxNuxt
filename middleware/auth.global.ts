const publicRoutes = ["/login", "/signup", "public"];
export default defineNuxtRouteMiddleware((to, from) => {
  console.log("Middleware: auth", to.path);
  if (publicRoutes.some((route) => to.path.startsWith(route))) {
    return;
  }

  const auth = useAuth();
  if (!auth.loggedIn.value) {
    auth.setPrevLink(to.path);
    return navigateTo("/login");
  }
});
