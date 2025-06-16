export default defineEventHandler(async (event) => {
  console.log("Handling photo upload request");
  const { user } = await requireUserSession(event);
  if (!user.id || isNaN(Number(user.id))) {
    throw createError({ statusCode: 400, message: "User ID is required" });
  }
  console.log("User session validated:", user.email);
  const query = getQuery(event);
  if (!query.pageId || isNaN(Number(query.pageId))) {
    console.error("Invalid or missing page ID:", query.pageId);
    throw createError({ statusCode: 400, message: "Page ID is required" });
  }
  const form = await readFormData(event);
  const file = form.get("file") as File;

  if (!file || !file.size) {
    console.error("No file provided or file is empty");
    throw createError({ statusCode: 400, message: "No file provided" });
  }

  ensureBlob(file, {
    maxSize: "1MB",
    types: ["image"],
  });

  return await hubBlob().put(
    `${user.email}/${query.pageId}/${file.name}`,
    file,
    {
      addRandomSuffix: true,
      prefix: "images",
    },
  );
});
