import { eq, tables, useDrizzle } from "~/server/utils/drizzle";

export default eventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const { user } = await requireUserSession(event);
  if (!id || isNaN(Number(id))) {
    console.error("Invalid block ID:", id);
    throw createError({ statusCode: 400, message: "Block ID is required" });
  }
  const { textContent } = await readBody<{
    textContent: string;
  }>(event);

  const drizzle = useDrizzle();
  const block = await drizzle
    .update(tables.blocks)
    .set({ textContent })
    .where(eq(tables.blocks.id, Number(id)))
    .returning()
    .get();
  drizzle
    .update(tables.pages)
    .set({ lastUpdatedAt: new Date(), lastUpdatedByName: user.name })
    .where(
      and(eq(tables.pages.id, block.pageId), eq(tables.pages.userId, user.id)),
    )
    .run();
  if (!block) {
    throw createError({ statusCode: 500, message: "Block update failed" });
  }
  const pageImages = await hubBlob().list({
    prefix: `images/${user.email}/${block.pageId}`,
  });
  const imgMatches = textContent.match(/!\[.*?\]\((.*?)\)/g) || [];
  const imageUrls = imgMatches
    .map((match) => {
      const urlMatch = match.match(/\((.*?)\)/);
      return urlMatch ? urlMatch[1] : null;
    })
    .filter(Boolean);
  const missingImages = imageUrls.filter(
    (url) => !pageImages.blobs.some((item) => item.pathname === url),
  );
  missingImages.forEach((url) => {
    if (url?.startsWith("https://") || url?.startsWith("http://") || !url) {
      return;
    }
    console.warn(`Deleting missing image: ${url}`);
    hubBlob().del(url);
  });
  return {
    statusCode: 200,
    body: { ...block },
  };
});
