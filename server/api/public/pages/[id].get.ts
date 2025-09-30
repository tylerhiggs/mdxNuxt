import { desc } from "drizzle-orm";
import { pages } from "~~/server/database/schema";
import { MdNode } from "~~/shared/types";
export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  if (!id || isNaN(Number(id))) {
    throw createError({ statusCode: 400, message: "Page ID is required" });
  }
  const queriedPage = await useDrizzle().query.pages.findFirst({
    where: (pages, { eq, isNull, and }) =>
      and(
        eq(pages.id, Number(id)),
        isNull(pages.deletedAt),
        eq(pages.isPublic, true),
      ),
    with: {
      blocks: {
        orderBy: (blocks) => desc(blocks.index),
      },
      user: true,
    },
  });
  if (!queriedPage) {
    throw createError({ statusCode: 404, message: "Page not found" });
  }
  try {
    useDrizzle()
      .update(pages)
      .set({ views: sql`${pages.views} + 1` })
      .where(eq(pages.id, Number(id)))
      .run();
  } catch (e) {
    console.error("Error updating page views for page ", id, e);
  }
  return {
    statusCode: 200,
    body: {
      ...queriedPage,
      blocks: await Promise.all(
        queriedPage.blocks.map(async (block) =>
          block.type === "text"
            ? {
                ...block,
                renderedMd: JSON.parse(block.renderedMd) as MdNode[],
              }
            : { ...block, renderedMd: null },
        ),
      ),
    },
  };
});
