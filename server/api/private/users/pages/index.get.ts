import { eq, tables, useDrizzle } from "~/server/utils/drizzle";

/**
 * Just returns the pages metadata for a given user id,
 * for listing them out
 */
export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  if (!user.id || isNaN(Number(user.id))) {
    throw createError({ statusCode: 400, message: "User ID is required" });
  }
  const userPages = await useDrizzle()
    .select()
    .from(tables.pages)
    .where(eq(tables.pages.userId, Number(user.id)));
  if (!userPages) {
    throw createError({ statusCode: 404, message: "User not found" });
  }
  return {
    statusCode: 200,
    body: userPages.map((page) => ({
      id: page.id,
      title: page.title,
      emoji: page.emoji,
      isPublic: page.isPublic,
      isFavorite: page.isFavorite,
      lastUpdatedAt: page.lastUpdatedAt,
      lastUpdatedByName: page.lastUpdatedByName,
    })),
  };
});
