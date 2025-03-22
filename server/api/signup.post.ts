import { z } from "zod";
import { UserInsert } from "../utils/drizzle";

const bodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export default eventHandler(async (event) => {
  const { name, email, password } = await readValidatedBody(
    event,
    bodySchema.parse,
  );
  if (!name || !email || !password) {
    throw createError({
      statusCode: 400,
      message: "Name, email and password are required",
    });
  }
  const insertUser: UserInsert = {
    name,
    email,
    password: await hashPassword(password),
    avatar: "",
    createdAt: new Date(),
  };
  const user = await useDrizzle()
    .insert(tables.users)
    .values(insertUser)
    .returning()
    .get();
  if (!user) {
    throw createError({ statusCode: 500, message: "User creation failed" });
  }
  await setUserSession(event, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
  return {
    statusCode: 201,
    body: user,
  };
});
