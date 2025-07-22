export default eventHandler(async (event) => {
  const { id } = getRouterParams(event);
  if (!id || isNaN(Number(id))) {
    console.error("Invalid block ID:", id);
    return createError({ statusCode: 400, message: "Block ID is required" });
  }
  const block = await useDrizzle()
    .delete(tables.blocks)
    .where(eq(tables.blocks.id, Number(id)))
    .returning()
    .get();
  if (!block) {
    return createError({ statusCode: 500, message: "Block delete failed" });
  }
  return {
    statusCode: 200,
    body: { ...block },
  };
});
