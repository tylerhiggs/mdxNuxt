import { asc } from "drizzle-orm";
import { eq, tables, useDrizzle } from "~/server/utils/drizzle";

export default eventHandler(async (event) => {
  const { id } = getRouterParams(event);
  if (!id || isNaN(Number(id))) {
    throw createError({ statusCode: 400, message: "Page ID is required" });
  }
  const pages = await useDrizzle()
    .select()
    .from(tables.pages)
    .where(eq(tables.pages.id, Number(id)))
    .leftJoin(tables.blocks, eq(tables.blocks.pageId, tables.pages.id))
    .orderBy(asc(tables.blocks.index))
    .limit(1);
  if (!pages || !pages.length) {
    throw createError({ statusCode: 404, message: "Page not found" });
  }
  return {
    statusCode: 200,
    body: {
      ...pages[0],
      blocks: {
        ...pages[0].blocks,
      },
    },
  };
});
