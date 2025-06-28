import { eq, tables, useDrizzle } from "~/server/utils/drizzle";
import { MdNode } from "~/shared/types";

export default eventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const { user } = await requireUserSession(event);
  if (!id || isNaN(Number(id))) {
    console.error("Invalid block ID:", id);
    throw createError({ statusCode: 400, message: "Block ID is required" });
  }
  const { textContent, renderedMd } = await readBody<{
    textContent: string;
    renderedMd?: MdNode[];
  }>(event);

  const drizzle = useDrizzle();
  const block = await drizzle
    .update(tables.blocks)
    .set({ textContent, renderedMd: JSON.stringify(renderedMd) })
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
  const storedPageImages = await hubBlob().list({
    prefix: `images/${user.email}/${block.pageId}`,
  });
  const imgMatches = textContent.match(/!\[.*?\]\((.*?)\)/g) || [];
  const imageUrlsFromText = imgMatches
    .map((match) => {
      const urlMatch = match.match(/\((.*?)\)/);
      return urlMatch ? urlMatch[1] : null;
    })
    .filter(Boolean);
  const storedImagesNotInText = storedPageImages.blobs.filter(
    ({ pathname: url }) =>
      !imageUrlsFromText.includes(url) &&
      !url.startsWith(`images/${user.email}/${block.pageId}/cover/cover-`) &&
      !url?.startsWith("https://") &&
      !url?.startsWith("http://"),
  );
  hubBlob().delete(storedImagesNotInText.map((item) => item.pathname));
  return {
    statusCode: 200,
    body: { ...block },
  };
});
