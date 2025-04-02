export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { pathname } = getRouterParams(event);
  if (!pathname.includes(user.email)) {
    throw createError({
      statusCode: 403,
      message: "Forbidden",
    });
  }
  setHeader(event, "Content-Security-Policy", "default-src 'none';");
  return hubBlob().serve(event, pathname);
});
