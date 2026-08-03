import "server-only";

import { sql } from "drizzle-orm";

import { getDatabase } from "./client";

export async function checkDatabaseHealth(): Promise<boolean> {
  await getDatabase().execute(sql`select 1`);
  return true;
}
