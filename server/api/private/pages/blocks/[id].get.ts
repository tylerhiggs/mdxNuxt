import { asc } from "drizzle-orm";
import { eq, tables, useDrizzle } from "~/server/utils/drizzle";

export default eventHandler(async (event) => {
  const { id } = getRouterParams(event);
  if (!id || isNaN(Number(id))) {
    console.error("Invalid page ID:", id);
    throw createError({ statusCode: 400, message: "Page ID is required" });
  }
  const blocks = await useDrizzle()
    .select()
    .from(tables.blocks)
    .where(eq(tables.blocks.pageId, Number(id)))
    .orderBy(asc(tables.blocks.index))
    .all();
  if (!blocks) {
    throw createError({ statusCode: 500, message: "Blocks not found" });
  }
  return {
    statusCode: 200,
    body: { blocks },
  };
});
