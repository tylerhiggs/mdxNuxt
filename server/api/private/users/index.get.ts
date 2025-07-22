export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  if (!user.id) {
    throw createError({ statusCode: 400, message: "User ID is required" });
  }
  const dbUser = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.id, user.id))
    .limit(1)
    .get();
  if (!dbUser) {
    throw createError({ statusCode: 404, message: "User not found" });
  }
  return {
    statusCode: 200,
    body: {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      avatar: dbUser.avatar,
      createdAt: dbUser.createdAt,
    },
  };
});
