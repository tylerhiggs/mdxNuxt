import { relations } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  index,
  real,
} from "drizzle-orm/sqlite-core";
import type { AnySQLiteColumn } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
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
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    emoji: text("emoji").notNull(),
    coverUrl: text("coverUrl").notNull().default(""),
    isPublic: integer("isPublic", { mode: "boolean" }).notNull().default(false),
    isFavorite: integer("isFavorite", { mode: "boolean" })
      .notNull()
      .default(false),
    showOutline: integer("showOutline", { mode: "boolean" })
      .notNull()
      .default(true),
    path: text("path").notNull(),
    parentId: integer("parent_id").references((): AnySQLiteColumn => pages.id),
    lastUpdatedAt: integer("lastUpdatedAt", { mode: "timestamp" }).notNull(),
    lastUpdatedByName: text("lastUpdatedByName").notNull(),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
    createdByName: text("createdByName").notNull(),
    deletedAt: integer("deletedAt", { mode: "timestamp" }),
  },
  (table) => [index("page_user_id").on(table.userId)],
);

export const pagesRelations = relations(pages, ({ many, one }) => ({
  blocks: many(blocks),
  parent: one(pages, {
    fields: [pages.parentId],
    references: [pages.id],
  }),
  children: many(pages),
}));
export const blocks = sqliteTable(
  "blocks",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    pageId: integer("pageId")
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),
    index: real("index").notNull(),
    type: text("type", {
      enum: ["text", "table", "callout", "image", "code"],
    }).notNull(),
    textContent: text("textContent").notNull(),
    renderedMd: text("renderedMd").notNull().default("[]"),
    userId: integer("userId")
      .notNull()
      .default(0)
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index("block_page_id").on(table.pageId)],
);

export const blocksRelations = relations(blocks, ({ one }) => ({
  page: one(pages, {
    fields: [blocks.pageId],
    references: [pages.id],
  }),
}));
