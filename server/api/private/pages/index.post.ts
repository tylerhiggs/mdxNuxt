import { PageInsert, tables, useDrizzle } from "~/server/utils/drizzle";

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { path, parentId } = await readBody<{
    path: {
      id: string;
      title: string;
      emoji: string;
    }[];
    parentId?: string;
  }>(event);
  if (!user.id || !user.name || !path) {
    throw createError({ statusCode: 400, message: "Title is required" });
  }

  const insertObj: PageInsert = {
    title: "",
    emoji: "📄",
    userId: Number(user.id),
    isPublic: false,
    isFavorite: false,
    lastUpdatedAt: new Date(),
    lastUpdatedByName: user.name,
    createdAt: new Date(),
    createdByName: user.name,
    path: JSON.stringify(path),
    parentId: parentId ? Number(parentId) : null,
  };

  const page = await useDrizzle()
    .insert(tables.pages)
    .values(insertObj)
    .returning()
    .get();
  if (!page) {
    throw createError({ statusCode: 500, message: "Page creation failed" });
  }
  const block = await useDrizzle()
    .insert(tables.blocks)
    .values({
      pageId: page.id,
      index: 0,
      type: "text",
      textContent: "",
    })
    .returning()
    .get();
  if (!page) {
    throw createError({ statusCode: 500, message: "Page creation failed" });
  }
  return {
    statusCode: 201,
    body: {
      ...page,
      block: {
        ...block,
      },
    },
    statusMessage: "Page created successfully",
    headers: {
      "Content-Type": "application/json",
    },
  };
});
