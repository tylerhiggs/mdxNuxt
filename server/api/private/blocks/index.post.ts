import { tables, useDrizzle } from "~/server/utils/drizzle";

export default eventHandler(async (event) => {
  const { id } = getRouterParams(event);
  if (!id || isNaN(Number(id))) {
    console.error("Invalid page ID:", id);
    return createError({ statusCode: 400, message: "Page ID is required" });
  }
  const { textContent, pageId, index, type } = await readBody<{
    pageId: number;
    index: number;
    textContent: string;
    type?: string;
  }>(event);
  const block = await useDrizzle()
    .insert(tables.blocks)
    .values({
      pageId,
      textContent,
      index,
      type: type || "text",
    })
    .returning()
    .get();
  if (!block) {
    return createError({ statusCode: 500, message: "Block creation failed" });
  }
  return {
    statusCode: 200,
    body: { ...block },
  };
});
