import { pages } from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  if (!user.id || isNaN(Number(user.id))) {
    throw createError({ statusCode: 400, message: "User ID is required" });
  }
  const query = getQuery<{ pageId: string; isCover?: "true" | "false" }>(event);
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
    types: ["image", "image/gif"],
  });
  if (query.isCover && query.isCover === "true") {
    const storedPageCoverImages = await hubBlob().list({
      prefix: `images/${user.email}/${query.pageId}/cover`,
    });
    await hubBlob().delete(
      storedPageCoverImages.blobs.map((item) => item.pathname),
    );
    const blob = await hubBlob().put(
      `${user.email}/${query.pageId}/cover/cover-${file.name}`,
      file,
      {
        addRandomSuffix: true,
        prefix: "images",
      },
    );
    // Update the page cover in the database
    useDrizzle()
      .update(pages)
      .set({
        coverUrl: blob.pathname,
      })
      .where(eq(pages.id, Number(query.pageId)))
      .execute();
    return blob;
  }

  return await hubBlob().put(
    `${user.email}/${query.pageId}/${file.name}`,
    file,
    {
      addRandomSuffix: true,
      prefix: "images",
    },
  );
});
