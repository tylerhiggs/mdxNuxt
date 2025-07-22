export default eventHandler(async (event) => {
  const { id } = getRouterParams(event);
  if (!id || isNaN(Number(id))) {
    throw createError({ statusCode: 400, message: "Page ID is required" });
  }
  const page = await useDrizzle()
    .update(tables.pages)
    .set({ deletedAt: new Date() })
    .where(eq(tables.pages.id, Number(id)))
    .returning()
    .get();
  if (!page) {
    throw createError({ statusCode: 500, message: "Page deletion failed" });
  }
  return {
    statusCode: 200,
    body: { message: "Page deleted successfully", pageId: page.id },
  };
});
