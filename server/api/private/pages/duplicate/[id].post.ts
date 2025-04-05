export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { id } = getRouterParams(event);
  if (!id || isNaN(Number(id))) {
    throw createError({ statusCode: 400, message: "Page ID is required" });
  }
  const drizzle = useDrizzle();
  const page = await drizzle.query.pages.findFirst({
    where: (pages, { eq }) =>
      and(eq(pages.id, Number(id)), eq(pages.userId, Number(user.id))),
    with: {
      blocks: true,
    },
  });
  if (!page) {
    throw createError({ statusCode: 404, message: "Page not found" });
  }
  const {
    id: _,
    isPublic: _isPublic,
    isFavorite: _isFavorite,
    blocks,
    ...pageWithoutId
  } = page;
  const newPage = await drizzle
    .insert(tables.pages)
    .values({
      ...pageWithoutId,
      title: `${page.title} (copy)`,
      lastUpdatedAt: new Date(),
      createdAt: new Date(),
      lastUpdatedByName: user.name,
      createdByName: user.name,
    })
    .returning()
    .get();
  if (!newPage) {
    console.error("Page duplication failed: Failed to insert new page into db");
    throw createError({ statusCode: 500, message: "Page duplication failed" });
  }
  const prevPath = JSON.parse(newPage.path) as {
    id: number;
    title: string;
    emoji: string;
  }[];
  const newPath = prevPath.map((p) =>
    p.id === Number(id) ? { ...p, id: newPage.id } : p,
  );
  const path = JSON.stringify(newPath);
  const newUpdatedPage = await useDrizzle()
    .update(tables.pages)
    .set({
      path,
    })
    .where(eq(tables.pages.id, newPage.id))
    .returning()
    .get();

  const newBlocks = blocks.map(({ id: _id, ...block }) => ({
    ...block,
    pageId: newPage.id,
  }));
  await useDrizzle().insert(tables.blocks).values(newBlocks).returning().get();
  if (!newPage) {
    throw createError({ statusCode: 500, message: "Page duplication failed" });
  }
  return {
    statusCode: 200,
    body: { ...newUpdatedPage, blocks: newBlocks },
  };
});
