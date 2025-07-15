import { desc } from "drizzle-orm";
import { MdNode } from "~/shared/types";
import { Page } from "~/types/page";
export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  if (id === "home") {
    const homePageData = await import("~/server/assets/home-page.json");
    return {
      statusCode: 200,
      body: homePageData as Page,
    };
  }
  if (!id || isNaN(Number(id))) {
    throw createError({ statusCode: 400, message: "Page ID is required" });
  }
  const page = await useDrizzle().query.pages.findFirst({
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
                renderedMd: JSON.parse(block.renderedMd) as MdNode[],
              }
            : { ...block, renderedMd: null },
        ),
      ),
    },
  };
});
