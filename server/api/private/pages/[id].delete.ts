export default eventHandler(async (event) => {
  const { id } = getRouterParams(event);
  if (!id || isNaN(Number(id))) {
    throw createError({ statusCode: 400, message: "Page ID is required" });
  }

  const db = useDrizzle();

  // Delete blocks first (assuming foreign key relationship)
  await db.delete(tables.blocks).where(eq(tables.blocks.pageId, Number(id)));

  // Then delete the page
  const deletedPage = await db
    .delete(tables.pages)
    .where(eq(tables.pages.id, Number(id)))
    .returning()
    .get();

  if (!deletedPage) {
    throw createError({ statusCode: 404, message: "Page not found" });
  }

  return {
    statusCode: 200,
    body: { message: "Page deleted successfully", pageId: deletedPage.id },
  };
});
