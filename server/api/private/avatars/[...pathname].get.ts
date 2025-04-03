export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { pathname } = getRouterParams(event);
  console.log("do I even make it here");
  if (!pathname.includes(user.email.replace(".com", ""))) {
    console.error(
      "User not authorized to access this resource, user email not in pathname",
      pathname,
    );
    throw createError({
      statusCode: 403,
      message: "Forbidden",
    });
  }
  setHeader(event, "Content-Security-Policy", "default-src 'none';");
  return hubBlob().serve(event, pathname);
});
