import { users } from "~/server/database/schema";
import { useDrizzle } from "~/server/utils/drizzle";
import type { H3Event, H3Error } from "h3";

export default defineOAuthGoogleEventHandler({
  async onSuccess(
    event: H3Event,
    { user }: { user: { name: string; email: string; picture: string } },
  ) {
    const response = await fetch(user.picture);
    if (!response.ok) {
      console.error("Error fetching user picture:", response.statusText);
      sendRedirect(event, "/login");
    }
    const imageBlob = await response.blob();
    ensureBlob(imageBlob, {
      types: ["image"],
      maxSize: "1MB",
    });
    const blobUrl = await hubBlob().put(user.email, imageBlob, {
      addRandomSuffix: true,
      prefix: "user-avatars",
    });
    let dbUser = await useDrizzle()
      .insert(users)
      .values({
        name: user.name,
        email: user.email,
        avatar: blobUrl.pathname,
        createdAt: new Date(),
      })
      .onConflictDoNothing({
        target: users.email,
      })
      .returning()
      .get();
    if (!dbUser) {
      const existingUser = await useDrizzle()
        .select()
        .from(users)
        .where(eq(users.email, user.email))
        .limit(1)
        .get();
      dbUser = existingUser || dbUser;
    }
    await setUserSession(event, {
      user: {
        id: dbUser.id,
        name: user.name,
        email: user.email,
        avatar: blobUrl.pathname,
      },
    });
    return sendRedirect(event, "/edit");
  },
  onError(event: H3Event, error: H3Error) {
    console.error("Error during Google OAuth:", error);
    return sendRedirect(event, "/");
  },
});
