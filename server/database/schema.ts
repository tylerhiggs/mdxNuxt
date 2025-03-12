import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    avatar: text("avatar").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [index("user_email").on(table.email)],
);

export const pages = sqliteTable(
  "pages",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("userId")
      .notNull()
      .references(() => users.id),
    title: text("title").notNull(),
    emoji: text("emoji").notNull(),
    blocks: text("blocks").notNull(),
  },
  (table) => [index("page_user_id").on(table.userId)],
);

export const blocks = sqliteTable(
  "blocks",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    pageId: integer("pageId")
      .notNull()
      .references(() => pages.id),
    index: integer("index").notNull(),
    type: text("type").notNull(),
    textContent: text("textContent").notNull(),
  },
  (table) => [index("block_page_id").on(table.pageId)],
);
