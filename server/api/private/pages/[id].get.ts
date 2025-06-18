import { asc } from "drizzle-orm";
import { useDrizzle } from "~/server/utils/drizzle";
import { MdNode } from "~/shared/types";
export default eventHandler(async (event) => {
  const { id } = getRouterParams(event);
  if (!id || isNaN(Number(id))) {
    console.error(
      "[pages.get]: Error getting page - ",
      id,
      " - No page ID provided",
    );
    throw createError({ statusCode: 400, message: "Page ID is required" });
  }
  console.log("successfully got page id", id);
  const pages = await useDrizzle().query.pages.findMany({
    with: {
      blocks: {
        orderBy: (blocks) => asc(blocks.index),
      },
    },
    where: (pages, { eq }) => eq(pages.id, Number(id)),
  });
  if (!pages || !pages.length) {
    console.error("[pages.get]: Error getting page - ", id, " - No page found");
    throw createError({ statusCode: 404, message: "Page not found" });
  }
  return {
    statusCode: 200,
    body: {
      ...pages[0],
      lastUpdatedAt: pages[0].lastUpdatedAt.getTime(),
      createdAt: pages[0].createdAt.getTime(),
      blocks: await Promise.all(
        pages[0].blocks.map(async (block) =>
          block.type === "text"
            ? {
                ...block,
                renderedMd: JSON.parse(block.renderedMd) as MdNode[],
              }
            : block,
        ),
      ),
    },
  };
});
