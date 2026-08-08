import { boolean, index, integer, jsonb, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { content } from "./content";

export const forms = content.table("forms", {
  id: varchar("id", { length: 40 }).primaryKey(),
  formType: varchar("form_type", { length: 30 }).notNull(),
  fullName: varchar("full_name", { length: 120 }).notNull(),
  email: varchar("email", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 32 }),
  payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
  acceptedTerms: boolean("accepted_terms").notNull(),
  reviewStatus: varchar("review_status", { length: 30 }).notNull().default("pending"),
  reviewerNotes: text("reviewer_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("forms_form_type_index").on(table.formType),
  index("forms_created_at_index").on(table.createdAt),
  index("forms_review_status_index").on(table.formType, table.reviewStatus),
]);

export const contentSections = content.table("content_sections", {
  id: varchar("id", { length: 80 }).primaryKey(),
  section: varchar("section", { length: 80 }).notNull(),
  content: jsonb("content").$type<unknown>().notNull(),
  position: integer("position").notNull(),
  isPublished: boolean("is_published").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("content_sections_section_index").on(table.section, table.position),
  index("content_sections_published_index").on(table.section, table.isPublished),
]);
