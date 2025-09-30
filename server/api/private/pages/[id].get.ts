import { asc } from "drizzle-orm";
import type { MdNode } from "~~/shared/types";
export default eventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const { user } = await requireUserSession(event);
  if (!id || isNaN(Number(id))) {
    console.error(
      "[pages.get]: Error getting page - ",
      id,
      " - No page ID provided",
    );
    throw createError({ statusCode: 400, message: "Page ID is required" });
  }
  const drizzle = useDrizzle();
  const queriedPages = await drizzle.query.pages.findMany({
    with: {
      blocks: {
        orderBy: (blocks) => asc(blocks.index),
      },
      user: true,
    },
    where: (pages, { eq, and }) =>
      and(eq(pages.id, Number(id)), eq(pages.userId, user.id)),
    limit: 1,
  });

  if (!queriedPages || !queriedPages.length) {
    console.error("[pages.get]: Error getting page - ", id, " - No page found");
    throw createError({ statusCode: 404, message: "Page not found" });
  }
  return {
    statusCode: 200,
    body: {
      ...queriedPages[0],
      lastUpdatedAt: queriedPages[0].lastUpdatedAt.getTime(),
      createdAt: queriedPages[0].createdAt.getTime(),
      blocks: await Promise.all(
        queriedPages[0].blocks.map(async (block) =>
          block.type === "text"
            ? {
                ...block,
                renderedMd: JSON.parse(block.renderedMd) as MdNode[],
              }
            : {
                ...block,
                renderedMd: [],
              },
        ),
      ),
    },
  };
});
