import { index, primaryKey, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { content } from "./content";
import { properties } from "./properties";
import { users } from "./users";

export const userFavorites = content.table("user_favorites", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  propertyId: varchar("property_id", { length: 50 }).notNull().references(() => properties.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.userId, table.propertyId] }),
  index("user_favorites_user_index").on(table.userId),
  index("user_favorites_property_index").on(table.propertyId),
]);
