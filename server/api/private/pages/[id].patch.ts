import { eq, tables, useDrizzle } from "~/server/utils/drizzle";

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { id } = getRouterParams(event);
  if (!id || isNaN(Number(id))) {
    console.error("Invalid page ID:", id);
    throw createError({ statusCode: 400, message: "Page ID is required" });
  }
  const { title, emoji, isPublic, isFavorite } = await readBody<
    Partial<{
      title: string;
      emoji: string;
      isPublic: boolean;
      isFavorite: boolean;
    }>
  >(event);
  const drizzle = useDrizzle();

  // Get the previous value of the `path` column
  const previousPage = await drizzle
    .select({
      id: tables.pages.id,
      path: tables.pages.path,
    })
    .from(tables.pages)
    .where(eq(tables.pages.id, Number(id)))
    .get();

  if (!previousPage) {
    throw createError({ statusCode: 404, message: "Page not found" });
  }

  const prevPath = JSON.parse(previousPage.path) as {
    id: number;
    title: string;
    emoji: string;
  }[];

  const pathObj = prevPath.map((p) =>
    p.id === Number(id)
      ? {
          ...p,
          ...(title !== undefined && { title }),
          ...(emoji !== undefined && { emoji }),
        }
      : p,
  );

  const path = JSON.stringify(pathObj);

  // Update the page and include the previous `path` value if needed
  const page = await drizzle
    .update(tables.pages)
    .set({
      title,
      emoji,
      isPublic,
      isFavorite,
      lastUpdatedAt: new Date(),
      lastUpdatedByName: user.name,
      path,
    })
    .where(eq(tables.pages.id, Number(id)))
    .returning()
    .get();
  if (!page) {
    throw createError({ statusCode: 500, message: "Page update failed" });
  }
  return {
    statusCode: 200,
    body: { ...page },
  };
});
