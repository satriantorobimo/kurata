import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

let pool: Pool | undefined;

function databaseUrl(): string {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL is required for database access.");
  }

  return url;
}

export function getDatabase() {
  pool ??= new Pool({ connectionString: databaseUrl(), max: 10, idleTimeoutMillis: 30_000, connectionTimeoutMillis: 5_000 });

  return drizzle({ client: pool, schema });
}

export async function closeDatabasePool() {
  if (!pool) return;

  await pool.end();
  pool = undefined;
}
