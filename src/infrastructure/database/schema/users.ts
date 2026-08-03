import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgSchema,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
  text,
} from "drizzle-orm/pg-core";

export const auth = pgSchema("auth");
export const authPrivate = pgSchema("auth_private");
export const core = pgSchema("core");

export const userRole = auth.enum("user_role", ["user", "broker", "admin", "super_admin"]);
export const accountStatus = auth.enum("account_status", [
  "active",
  "suspended",
  "archived",
]);
export const verificationStatus = core.enum("verification_status", [
  "not_started",
  "submitted",
  "under_review",
  "approved",
  "changes_requested",
  "rejected",
]);

export const users = auth.table(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 160 }).notNull(),
    fullName: varchar("full_name", { length: 120 }).notNull(),
    phone: varchar("phone", { length: 32 }),
    role: userRole("role").notNull().default("user"),
    status: accountStatus("status").notNull().default("active"),
    emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
    lastSignedInAt: timestamp("last_signed_in_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("users_email_unique").on(table.email),
    index("users_role_status_index").on(table.role, table.status),
  ],
);

export const passwordCredentials = authPrivate.table("password_credentials", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  passwordHash: text("password_hash").notNull(),
  passwordChangedAt: timestamp("password_changed_at", { withTimezone: true }).notNull().defaultNow(),
  mustChangePassword: boolean("must_change_password").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = authPrivate.table(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: varchar("token_hash", { length: 64 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
    authenticatedAt: timestamp("authenticated_at", { withTimezone: true }).notNull().defaultNow(),
    mfaCompletedAt: timestamp("mfa_completed_at", { withTimezone: true }),
    idleExpiresAt: timestamp("idle_expires_at", { withTimezone: true }).notNull(),
    absoluteExpiresAt: timestamp("absolute_expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    revocationReason: varchar("revocation_reason", { length: 80 }),
    ipHash: varchar("ip_hash", { length: 64 }),
    userAgentSummary: varchar("user_agent_summary", { length: 256 }),
  },
  (table) => [
    uniqueIndex("sessions_token_hash_unique").on(table.tokenHash),
    index("sessions_user_active_index").on(table.userId, table.revokedAt, table.absoluteExpiresAt),
    index("sessions_expiry_index").on(table.idleExpiresAt, table.absoluteExpiresAt),
  ],
);

export const emailVerificationTokens = authPrivate.table(
  "email_verification_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: varchar("token_hash", { length: 64 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("email_verification_tokens_hash_unique").on(table.tokenHash),
    index("email_verification_tokens_user_expiry_index").on(table.userId, table.expiresAt),
  ],
);

export const passwordResetTokens = authPrivate.table(
  "password_reset_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: varchar("token_hash", { length: 64 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("password_reset_tokens_hash_unique").on(table.tokenHash),
    index("password_reset_tokens_user_expiry_index").on(table.userId, table.expiresAt),
  ],
);

export const securityEvents = authPrivate.table(
  "security_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    eventType: varchar("event_type", { length: 120 }).notNull(),
    ipHash: varchar("ip_hash", { length: 64 }),
    userAgentSummary: varchar("user_agent_summary", { length: 256 }),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("security_events_user_created_index").on(table.userId, table.createdAt),
    index("security_events_event_created_index").on(table.eventType, table.createdAt),
  ],
);

export const userProfiles = core.table("user_profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  city: varchar("city", { length: 100 }),
  address: text("address"),
  avatarObjectKey: varchar("avatar_object_key", { length: 512 }),
  marketingConsent: boolean("marketing_consent").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const userVerifications = core.table(
  "user_verifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: verificationStatus("status").notNull().default("not_started"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    reviewerId: uuid("reviewer_id").references(() => users.id, { onDelete: "set null" }),
    reviewerNotes: text("reviewer_notes"),
    version: integer("version").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("user_verifications_user_unique").on(table.userId),
    index("user_verifications_status_submitted_index").on(table.status, table.submittedAt),
  ],
);

export const auditEvents = core.table(
  "audit_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorUserId: uuid("actor_user_id").references(() => users.id, { onDelete: "set null" }),
    subjectUserId: uuid("subject_user_id").references(() => users.id, { onDelete: "set null" }),
    eventType: varchar("event_type", { length: 120 }).notNull(),
    entityType: varchar("entity_type", { length: 80 }).notNull(),
    entityId: uuid("entity_id"),
    metadata: text("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("audit_events_entity_index").on(table.entityType, table.entityId),
    index("audit_events_subject_created_index").on(table.subjectUserId, table.createdAt),
  ],
);

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles),
  verification: one(userVerifications, {
    fields: [users.id],
    references: [userVerifications.userId],
  }),
  auditEventsAsActor: many(auditEvents, { relationName: "audit_actor" }),
  auditEventsAsSubject: many(auditEvents, { relationName: "audit_subject" }),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, { fields: [userProfiles.userId], references: [users.id] }),
}));

export const userVerificationsRelations = relations(userVerifications, ({ one }) => ({
  user: one(users, { fields: [userVerifications.userId], references: [users.id] }),
  reviewer: one(users, {
    fields: [userVerifications.reviewerId],
    references: [users.id],
    relationName: "verification_reviewer",
  }),
}));

export const auditEventsRelations = relations(auditEvents, ({ one }) => ({
  actor: one(users, {
    fields: [auditEvents.actorUserId],
    references: [users.id],
    relationName: "audit_actor",
  }),
  subject: one(users, {
    fields: [auditEvents.subjectUserId],
    references: [users.id],
    relationName: "audit_subject",
  }),
}));
