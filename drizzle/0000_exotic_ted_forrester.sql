CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE SCHEMA "core";
--> statement-breakpoint
CREATE TYPE "auth"."account_status" AS ENUM('active', 'suspended', 'archived');--> statement-breakpoint
CREATE TYPE "auth"."user_role" AS ENUM('user', 'broker', 'admin');--> statement-breakpoint
CREATE TYPE "core"."verification_status" AS ENUM('not_started', 'submitted', 'under_review', 'approved', 'changes_requested', 'rejected');--> statement-breakpoint
CREATE TABLE "core"."audit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_user_id" uuid,
	"subject_user_id" uuid,
	"event_type" varchar(120) NOT NULL,
	"entity_type" varchar(80) NOT NULL,
	"entity_id" uuid,
	"metadata" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "core"."user_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"city" varchar(100),
	"address" text,
	"avatar_object_key" varchar(512),
	"marketing_consent" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "core"."user_verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "core"."verification_status" DEFAULT 'not_started' NOT NULL,
	"submitted_at" timestamp with time zone,
	"reviewed_at" timestamp with time zone,
	"reviewer_id" uuid,
	"reviewer_notes" text,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firebase_uid" varchar(128),
	"email" varchar(160) NOT NULL,
	"full_name" varchar(120) NOT NULL,
	"phone" varchar(32),
	"role" "auth"."user_role" DEFAULT 'user' NOT NULL,
	"status" "auth"."account_status" DEFAULT 'active' NOT NULL,
	"email_verified_at" timestamp with time zone,
	"last_signed_in_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_firebase_uid_unique" UNIQUE("firebase_uid")
);
--> statement-breakpoint
ALTER TABLE "core"."audit_events" ADD CONSTRAINT "audit_events_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "core"."audit_events" ADD CONSTRAINT "audit_events_subject_user_id_users_id_fk" FOREIGN KEY ("subject_user_id") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "core"."user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "core"."user_verifications" ADD CONSTRAINT "user_verifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "core"."user_verifications" ADD CONSTRAINT "user_verifications_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_events_entity_index" ON "core"."audit_events" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "audit_events_subject_created_index" ON "core"."audit_events" USING btree ("subject_user_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "user_verifications_user_unique" ON "core"."user_verifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_verifications_status_submitted_index" ON "core"."user_verifications" USING btree ("status","submitted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "auth"."users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_role_status_index" ON "auth"."users" USING btree ("role","status");