import { eq, tables, useDrizzle } from "~/server/utils/drizzle";

export default eventHandler(async (event) => {
  const { id } = getRouterParams(event);
  if (!id || isNaN(Number(id))) {
    console.error("Invalid block ID:", id);
    throw createError({ statusCode: 400, message: "Block ID is required" });
  }
  const { textContent } = await readBody<{
    textContent: string;
  }>(event);
  const block = await useDrizzle()
    .update(tables.blocks)
    .set({ textContent })
    .where(eq(tables.blocks.id, Number(id)))
    .returning()
    .get();
  if (!block) {
    throw createError({ statusCode: 500, message: "Block update failed" });
  }
  return {
    statusCode: 200,
    body: { ...block },
  };
});
