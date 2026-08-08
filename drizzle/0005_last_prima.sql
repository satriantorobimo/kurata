ALTER TABLE "content"."properties" ADD COLUMN "review_status" varchar(30) DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "content"."properties" ADD COLUMN "listed_by" uuid;--> statement-breakpoint
ALTER TABLE "content"."forms" ADD COLUMN "review_status" varchar(30) DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "content"."forms" ADD COLUMN "reviewer_notes" text;--> statement-breakpoint
ALTER TABLE "content"."properties" ADD CONSTRAINT "properties_listed_by_users_id_fk" FOREIGN KEY ("listed_by") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "properties_listed_by_index" ON "content"."properties" USING btree ("listed_by");--> statement-breakpoint
CREATE INDEX "forms_review_status_index" ON "content"."forms" USING btree ("form_type","review_status");