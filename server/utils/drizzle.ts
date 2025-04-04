import { drizzle } from "drizzle-orm/d1";
export { sql, eq, and, or } from "drizzle-orm";

import * as schema from "../database/schema";

export const tables = schema;

export function useDrizzle() {
  return drizzle(hubDatabase(), { schema });
}

export type User = typeof schema.users.$inferSelect;
export type Page = typeof schema.pages.$inferSelect;
export type Block = typeof schema.blocks.$inferSelect;

export type UserInsert = typeof schema.users.$inferInsert;
export type PageInsert = typeof schema.pages.$inferInsert;
