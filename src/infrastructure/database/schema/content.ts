import { boolean, index, integer, jsonb, pgSchema, primaryKey, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const content = pgSchema("content");

export const siteStatistics = content.table("site_statistics", {
  id: varchar("id", { length: 80 }).primaryKey(),
  label: varchar("label", { length: 120 }).notNull(),
  value: varchar("value", { length: 80 }).notNull(),
  icon: varchar("icon", { length: 80 }).notNull(),
  displayOrder: integer("display_order").notNull(),
  isPublished: boolean("is_published").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const blogArticles = content.table("blog_articles", {
  slug: varchar("slug", { length: 180 }).primaryKey(),
  title: varchar("title", { length: 240 }).notNull(),
  excerpt: text("excerpt").notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  author: varchar("author", { length: 120 }).notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  readingMinutes: integer("reading_minutes").notNull(),
  coverImageUrl: text("cover_image_url").notNull(),
  coverImageAlt: varchar("cover_image_alt", { length: 300 }).notNull(),
  isFeatured: boolean("is_featured").notNull().default(false),
  isPublished: boolean("is_published").notNull().default(true),
}, (table) => [index("blog_articles_published_index").on(table.isPublished, table.publishedAt)]);

export const blogSections = content.table("blog_sections", {
  articleSlug: varchar("article_slug", { length: 180 }).notNull().references(() => blogArticles.slug, { onDelete: "cascade" }),
  position: integer("position").notNull(),
  heading: varchar("heading", { length: 300 }).notNull(),
  paragraphs: jsonb("paragraphs").$type<string[]>().notNull(),
  points: jsonb("points").$type<string[]>(),
  callout: text("callout"),
}, (table) => [index("blog_sections_article_index").on(table.articleSlug, table.position)]);

export const blogRelatedArticles = content.table("blog_related_articles", {
  articleSlug: varchar("article_slug", { length: 180 }).notNull().references(() => blogArticles.slug, { onDelete: "cascade" }),
  relatedSlug: varchar("related_slug", { length: 180 }).notNull().references(() => blogArticles.slug, { onDelete: "cascade" }),
  position: integer("position").notNull(),
}, (table) => [primaryKey({ columns: [table.articleSlug, table.relatedSlug] })]);
