import { index, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { content } from "./content";

export const sales = content.table("sales", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  location: varchar("location", { length: 120 }).notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("sales_email_index").on(table.email),
]);
