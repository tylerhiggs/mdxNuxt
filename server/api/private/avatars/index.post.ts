export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  if (!user) {
    throw createError({ statusCode: 400, message: "ID is required" });
  }
  const form = await readFormData(event);
  const file = form.get("avatar") as File;

  if (!file || !file.size) {
    throw createError({ statusCode: 400, message: "No file provided" });
  }

  ensureBlob(file, {
    maxSize: "1MB",
    types: ["image"],
  });

  const dbUser = await useDrizzle().query.users.findFirst({
    where: (users, { eq }) => eq(users.id, user.id),
  });
  const avatarPath = dbUser?.avatar;
  if (!avatarPath) {
    throw createError({ statusCode: 404, message: "User not found" });
  }
  console.log("Uploading avatar for user:", dbUser.id, "to path:", avatarPath);

  return hubBlob().put(avatarPath, file, {
    addRandomSuffix: false,
  });
});
