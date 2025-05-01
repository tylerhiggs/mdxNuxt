import { desc } from "drizzle-orm";
import { parseMd } from "~/shared/parseMd";
export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  if (!id || isNaN(Number(id))) {
    throw createError({ statusCode: 400, message: "Page ID is required" });
  }
  const page = await useDrizzle().query.pages.findFirst({
    where: (pages, { eq, isNull }) =>
      eq(pages.id, Number(id)) && isNull(pages.deletedAt),
    with: {
      blocks: {
        orderBy: (blocks) => desc(blocks.index),
      },
    },
  });
  if (!page) {
    throw createError({ statusCode: 404, message: "Page not found" });
  }
  return {
    statusCode: 200,
    body: {
      ...page,
      blocks: await Promise.all(
        page.blocks.map(async (block) =>
          block.type === "text"
            ? {
                ...block,
                renderedMd: await parseMd(block.textContent),
              }
            : { ...block, renderedMd: null },
        ),
      ),
    },
  };
});
