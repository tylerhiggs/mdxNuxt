import { asc } from "drizzle-orm";

/**
 * Just returns the pages metadata for a given user id,
 * for listing them out
 */
export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  if (!user.id || isNaN(Number(user.id))) {
    throw createError({ statusCode: 400, message: "User ID is required" });
  }
  const userPages = await useDrizzle().query.pages.findMany({
    where: (pages, { eq, isNull }) =>
      eq(pages.userId, Number(user.id)) && isNull(pages.deletedAt),
    orderBy: (pages) => [asc(pages.createdAt)],
  });
  if (!userPages) {
    throw createError({ statusCode: 404, message: "User not found" });
  }
  return {
    statusCode: 200,
    body: [...userPages],
  };
});
