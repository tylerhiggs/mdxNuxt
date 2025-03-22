import { eq, tables, useDrizzle } from "~/server/utils/drizzle";

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { id } = getRouterParams(event);
  if (!id || isNaN(Number(id))) {
    console.error("Invalid page ID:", id);
    throw createError({ statusCode: 400, message: "Page ID is required" });
  }
  const { title, emoji, isPublic, isFavorite } = await readBody<
    Partial<{
      title: string;
      emoji: string;
      isPublic: boolean;
      isFavorite: boolean;
    }>
  >(event);
  const page = await useDrizzle()
    .update(tables.pages)
    .set({
      title,
      emoji,
      isPublic,
      isFavorite,
      lastUpdatedAt: new Date(),
      lastUpdatedByName: user.name,
    })
    .where(eq(tables.pages.id, Number(id)))
    .returning()
    .get();
  if (!page) {
    throw createError({ statusCode: 500, message: "Page update failed" });
  }
  return {
    statusCode: 200,
    body: { ...page },
  };
});
