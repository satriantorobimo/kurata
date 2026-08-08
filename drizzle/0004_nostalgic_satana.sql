CREATE TABLE "content"."properties" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"city" varchar(100) NOT NULL,
	"province" varchar(100) NOT NULL,
	"price_amount" bigint NOT NULL,
	"area_sqm" integer NOT NULL,
	"certificate" varchar(10) NOT NULL,
	"badge" varchar(20),
	"image_url" text NOT NULL,
	"is_favorited" boolean DEFAULT false NOT NULL,
	"description" text,
	"dimensions" varchar(100),
	"zoning" varchar(100),
	"road_access" varchar(200),
	"legal_status" varchar(200),
	"address" text,
	"facilities" jsonb,
	"listed_at" varchar(50),
	"contact_label" varchar(100),
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content"."property_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" varchar(50) NOT NULL,
	"image_url" text NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content"."content_sections" (
	"id" varchar(80) PRIMARY KEY NOT NULL,
	"section" varchar(80) NOT NULL,
	"content" jsonb NOT NULL,
	"position" integer NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content"."forms" (
	"id" varchar(40) PRIMARY KEY NOT NULL,
	"form_type" varchar(30) NOT NULL,
	"full_name" varchar(120) NOT NULL,
	"email" varchar(160) NOT NULL,
	"phone" varchar(32),
	"payload" jsonb NOT NULL,
	"accepted_terms" boolean NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "content"."property_images" ADD CONSTRAINT "property_images_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "content"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "properties_published_index" ON "content"."properties" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "properties_badge_index" ON "content"."properties" USING btree ("badge");--> statement-breakpoint
CREATE INDEX "properties_certificate_index" ON "content"."properties" USING btree ("certificate");--> statement-breakpoint
CREATE INDEX "properties_price_index" ON "content"."properties" USING btree ("price_amount");--> statement-breakpoint
CREATE INDEX "properties_area_index" ON "content"."properties" USING btree ("area_sqm");--> statement-breakpoint
CREATE INDEX "properties_location_index" ON "content"."properties" USING btree ("province","city");--> statement-breakpoint
CREATE INDEX "property_images_property_index" ON "content"."property_images" USING btree ("property_id","position");--> statement-breakpoint
CREATE INDEX "content_sections_section_index" ON "content"."content_sections" USING btree ("section","position");--> statement-breakpoint
CREATE INDEX "content_sections_published_index" ON "content"."content_sections" USING btree ("section","is_published");--> statement-breakpoint
CREATE INDEX "forms_form_type_index" ON "content"."forms" USING btree ("form_type");--> statement-breakpoint
CREATE INDEX "forms_created_at_index" ON "content"."forms" USING btree ("created_at");