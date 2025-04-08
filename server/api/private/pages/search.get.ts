import { asc, desc } from "drizzle-orm";

type SearchResult = {
  id: number;
  title: string;
  emoji: string;
  createdAt: number;
  lastUpdatedAt: number;
  blocks: {
    id: number;
    textContent: string;
  }[];
};

export default eventHandler<{
  query: {
    search: string;
    titleOnly: "true" | "false";
    sortBy:
      | "bestMatches"
      | "newest-created"
      | "oldest-created"
      | "last-updated"
      | "oldest-updated";
    inPageId?: string;
    dateRange?: {
      start: number;
      end: number;
      type: "created" | "updated";
    };
  };
}>(async (event) => {
  const { user } = await requireUserSession(event);
  const query = getQuery(event);
  if (isNaN(Number(user.id))) {
    throw createError({
      statusCode: 400,
      message: "User ID is required and must be a number",
    });
  }
  console.log("search query", query);
  const drizzle = useDrizzle();
  const pagePromise = drizzle.query.pages.findMany({
    where: (pages, { eq, like, and, isNull }) => {
      const searchTerm = `%${query.search}%`;
      const userId = Number(user.id);
      const searchCondition = like(pages.title, searchTerm);
      const inPageIdCondition = query.inPageId
        ? eq(pages.id, Number(query.inPageId))
        : undefined;
      const deletedCondition = isNull(pages.deletedAt);
      const userCondition = eq(pages.userId, userId);
      const dateRangeCondition =
        query.dateRange && query.dateRange.type === "created"
          ? and(
              eq(pages.createdAt, new Date(query.dateRange.start)),
              eq(pages.createdAt, new Date(query.dateRange.end)),
            )
          : query.dateRange && query.dateRange.type === "updated"
            ? and(
                eq(pages.lastUpdatedAt, new Date(query.dateRange.start)),
                eq(pages.lastUpdatedAt, new Date(query.dateRange.end)),
              )
            : undefined;
      return and(
        deletedCondition,
        searchCondition,
        userCondition,
        inPageIdCondition,
        dateRangeCondition,
      );
    },
    limit: 10,
    orderBy: (pages) => {
      switch (query.sortBy) {
        case "bestMatches":
          return [];
        case "newest-created":
          return [desc(pages.createdAt)];
        case "oldest-created":
          return [asc(pages.createdAt)];
        case "last-updated":
          return [desc(pages.lastUpdatedAt)];
        case "oldest-updated":
          return [asc(pages.lastUpdatedAt)];
        default:
          return [desc(pages.createdAt)];
      }
    },
  });
  if (query.titleOnly !== "true") {
    console.log("made it here");
    const blocksPromise = drizzle.query.blocks.findMany({
      where: (blocks, { like }) => {
        const searchTerm = `%${query.search}%`;
        return like(blocks.textContent, searchTerm);
      },
      with: {
        page: true,
      },
      limit: 10,
    });
    const [blocks, pages] = await Promise.all([blocksPromise, pagePromise]);
    if (!blocks || !pages) {
      throw createError({ statusCode: 404, message: "Pages not found" });
    }
    const pagesToReturn = pages.map((page) => {
      const blocksForPage = blocks.filter((block) => block.pageId === page.id);
      return {
        ...page,
        blocks: blocksForPage.map(({ id, textContent }) => ({
          id,
          textContent,
        })),
      };
    });
    const pageBlocks = blocks.reduce(
      (acc, block) => {
        const pageId = block.page.id;
        if (!acc[pageId]) {
          acc[pageId] = [];
        }
        acc[pageId].push(block);
        return acc;
      },
      {} as Record<number, typeof blocks>,
    );
    const filteredPagesToReturn = pagesToReturn.filter(
      (page) => !pageBlocks[page.id],
    );

    const body: SearchResult[] = [
      ...filteredPagesToReturn.map(
        ({ id, title, emoji, createdAt, lastUpdatedAt }) => ({
          id,
          title,
          emoji,
          createdAt: createdAt.getTime(),
          lastUpdatedAt: lastUpdatedAt.getTime(),
          blocks: [],
        }),
      ),
      ...Object.values(pageBlocks).map((blocks) =>
        blocks.length
          ? {
              id: blocks[0].page.id,
              title: blocks[0].page.title,
              emoji: blocks[0].page.emoji,
              createdAt: blocks[0].page.createdAt.getTime(),
              lastUpdatedAt: blocks[0].page.lastUpdatedAt.getTime(),
              blocks: blocks.map(({ id, textContent }) => ({
                id,
                textContent,
              })),
            }
          : {
              id: blocks[0].page.id,
              title: blocks[0].page.title,
              emoji: blocks[0].page.emoji,
              createdAt: blocks[0].page.createdAt.getTime(),
              lastUpdatedAt: blocks[0].page.lastUpdatedAt.getTime(),
              blocks: [],
            },
      ),
    ];
    return {
      statusCode: 200,
      body,
    };
  }
  const onlyPages = await pagePromise;
  if (!onlyPages) {
    throw createError({ statusCode: 404, message: "Pages not found" });
  }
  const body: SearchResult[] = onlyPages.map(
    ({ id, title, emoji, createdAt, lastUpdatedAt }) => ({
      id,
      title,
      emoji,
      createdAt: createdAt.getTime(),
      lastUpdatedAt: lastUpdatedAt.getTime(),
      blocks: [],
    }),
  );
  return {
    statusCode: 200,
    body,
  };
});
