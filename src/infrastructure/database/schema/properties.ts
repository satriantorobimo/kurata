import { bigint, boolean, index, integer, jsonb, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { content } from "./content";
import { sales } from "./sales";
import { users } from "./users";

export const properties = content.table("properties", {
  id: varchar("id", { length: 50 }).primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  province: varchar("province", { length: 100 }).notNull(),
  priceAmount: bigint("price_amount", { mode: "number" }).notNull(),
  areaSqm: integer("area_sqm").notNull(),
  certificate: varchar("certificate", { length: 10 }).notNull(),
  badge: varchar("badge", { length: 20 }),
  imageUrl: text("image_url").notNull(),
  landType: varchar("land_type", { length: 30 }).notNull().default("common"),
  isFavorited: boolean("is_favorited").notNull().default(false),
  description: text("description"),
  dimensions: varchar("dimensions", { length: 100 }),
  zoning: varchar("zoning", { length: 100 }),
  roadAccess: varchar("road_access", { length: 200 }),
  legalStatus: varchar("legal_status", { length: 200 }),
  address: text("address"),
  facilities: jsonb("facilities").$type<string[]>(),
  listedAt: varchar("listed_at", { length: 50 }),
  contactLabel: varchar("contact_label", { length: 100 }),
  isPublished: boolean("is_published").notNull().default(true),
  reviewStatus: varchar("review_status", { length: 30 }).notNull().default("draft"),
  listedBy: uuid("listed_by").references(() => users.id, { onDelete: "set null" }),
  salesId: varchar("sales_id", { length: 50 }).references(() => sales.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("properties_published_index").on(table.isPublished),
  index("properties_badge_index").on(table.badge),
  index("properties_certificate_index").on(table.certificate),
  index("properties_price_index").on(table.priceAmount),
  index("properties_area_index").on(table.areaSqm),
  index("properties_location_index").on(table.province, table.city),
  index("properties_land_type_published_index").on(table.landType, table.isPublished),
  index("properties_listed_by_index").on(table.listedBy),
  index("properties_sales_id_index").on(table.salesId),
]);

export const propertyImages = content.table("property_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: varchar("property_id", { length: 50 }).notNull().references(() => properties.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  position: integer("position").notNull(),
}, (table) => [
  index("property_images_property_index").on(table.propertyId, table.position),
]);
