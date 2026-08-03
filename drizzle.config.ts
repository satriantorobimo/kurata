import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local", quiet: true });

const url = process.env.DATABASE_MIGRATION_URL ?? process.env.DATABASE_URL;

if (!url) {
  throw new Error("Set DATABASE_MIGRATION_URL or DATABASE_URL before running Drizzle.");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/infrastructure/database/schema/index.ts",
  out: "./drizzle",
  dbCredentials: { url },
  schemaFilter: ["auth", "core", "content"],
  strict: true,
  verbose: true,
});
