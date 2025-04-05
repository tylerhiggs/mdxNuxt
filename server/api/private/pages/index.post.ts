import { PageInsert, tables, useDrizzle } from "~/server/utils/drizzle";

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { path, parentId } = await readBody<{
    path: {
      id: number;
      title: string;
      emoji: string;
    }[];
    parentId?: number;
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
    path: JSON.stringify([...path, { id: -1, title: "", emoji: "📄" }]),
    parentId: parentId ? Number(parentId) : null,
    deletedAt: null,
  };

  const page = await useDrizzle()
    .insert(tables.pages)
    .values(insertObj)
    .returning()
    .get();
  if (!page) {
    throw createError({ statusCode: 500, message: "Page creation failed" });
  }
  // Update the path to include the correct page ID
  const updatedPage = await useDrizzle()
    .update(tables.pages)
    .set({
      path: JSON.stringify([...path, { id: page.id, title: "", emoji: "📄" }]),
    })
    .where(and(eq(tables.pages.id, page.id), eq(tables.pages.userId, user.id)))
    .returning()
    .get();
  const block = await useDrizzle()
    .insert(tables.blocks)
    .values({
      pageId: page.id,
      index: 0,
      type: "text",
      textContent: "",
      userId: Number(user.id),
    })
    .returning()
    .get();
  if (!updatedPage || !block) {
    throw createError({ statusCode: 500, message: "Page creation failed" });
  }
  return {
    statusCode: 201,
    body: {
      ...updatedPage,
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
