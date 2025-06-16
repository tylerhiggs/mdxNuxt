export default defineEventHandler(async (event) => {
  const { pathname } = getRouterParams(event);
  if (!pathname) {
    console.error("Pathname is required");
    throw createError({ statusCode: 400, message: "Pathname is required" });
  }
  const pageId = pathname.split("/")[2];

  if (!pageId || isNaN(Number(pageId))) {
    console.error("Invalid page ID:", pageId);
    throw createError({ statusCode: 400, message: "Page ID is required" });
  }
  // make sure page id is for a public page
  const drizzle = useDrizzle();
  const page = await drizzle
    .select()
    .from(tables.pages)
    .where(
      and(eq(tables.pages.id, Number(pageId)), eq(tables.pages.isPublic, true)),
    )
    .limit(1)
    .get();
  if (!page) {
    console.error("Page not found or not public:", pageId);
    throw createError({ statusCode: 404, message: "Page not found" });
  }

  // Log the requested pathname
  console.log("Requested pathname:", pathname);

  // Serve the requested page
  return hubBlob().serve(event, pathname);
});
