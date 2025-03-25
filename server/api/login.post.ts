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
  console.log("User found", user);
  if (await verifyPassword(user.password, password)) {
    console.log("Password verified, setting user session");
    const res = await setUserSession(event, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
    console.log("User session set", res);
    return {};
  }
  console.error("Invalid password");
  throw createError({
    statusCode: 401,
    message: "Invalid email or password",
  });
});
