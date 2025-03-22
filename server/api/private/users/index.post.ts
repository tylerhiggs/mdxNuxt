import { eq, tables, useDrizzle } from "~/server/utils/drizzle";

export default eventHandler(async (event) => {
  const { id } = getRouterParams(event);
  if (!id || isNaN(Number(id))) {
    throw createError({ statusCode: 400, message: "User ID is required" });
  }
  const { name, email } = await readBody<{
    name: string;
    email: string;
  }>(event);
  const user = await useDrizzle()
    .update(tables.users)
    .set({ name, email })
    .where(eq(tables.users.id, Number(id)))
    .returning()
    .get();
  if (!user) {
    throw createError({ statusCode: 500, message: "User update failed" });
  }
  return {
    statusCode: 200,
    body: { ...user },
  };
});
