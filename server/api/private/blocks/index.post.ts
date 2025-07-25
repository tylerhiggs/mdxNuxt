import type { MdNode } from "~~/shared/types";

export default eventHandler(async (event) => {
  const { id } = getRouterParams(event);
  if (!id || isNaN(Number(id))) {
    console.error("Invalid page ID:", id);
    return createError({ statusCode: 400, message: "Page ID is required" });
  }
  const { textContent, pageId, index, type, renderedMd } = await readBody<{
    pageId: number;
    index: number;
    textContent: string;
    type?: "text";
    renderedMd?: MdNode;
  }>(event);
  const block = await useDrizzle()
    .insert(tables.blocks)
    .values({
      pageId,
      textContent,
      index,
      type: type || "text",
      renderedMd: JSON.stringify(renderedMd) || "[]",
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
