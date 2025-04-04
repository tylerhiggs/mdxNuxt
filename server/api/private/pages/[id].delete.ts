import { eq, tables, useDrizzle } from "~/server/utils/drizzle";

export default eventHandler(async (event) => {
  const { pageId } = getRouterParams(event);
  if (!pageId || isNaN(Number(pageId))) {
    throw createError({ statusCode: 400, message: "Page ID is required" });
  }
  const page = await useDrizzle()
    .delete(tables.pages)
    .where(eq(tables.pages.id, Number(pageId)))
    .returning()
    .get();
  if (!page) {
    throw createError({ statusCode: 500, message: "Page deletion failed" });
  }
  return {
    statusCode: 200,
    body: { message: "Page deleted successfully", pageId: page.id },
  };
});
