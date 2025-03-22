import { z } from "zod";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default eventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, bodySchema.parse);
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: "Email and password are required",
    });
  }
  const user = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.email, email))
    .limit(1)
    .get();
  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Invalid email or password",
    });
  }
  if (await verifyPassword(await hashPassword(password), user.password)) {
    throw createError({
      statusCode: 401,
      message: "Invalid email or password",
    });
  }
  await setUserSession(event, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
  return {
    statusCode: 200,
    body: { ...user },
  };
});
