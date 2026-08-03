CREATE SCHEMA "content";
--> statement-breakpoint
CREATE TABLE "content"."blog_articles" (
	"slug" varchar(180) PRIMARY KEY NOT NULL,
	"title" varchar(240) NOT NULL,
	"excerpt" text NOT NULL,
	"category" varchar(80) NOT NULL,
	"author" varchar(120) NOT NULL,
	"published_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone,
	"reading_minutes" integer NOT NULL,
	"cover_image_url" text NOT NULL,
	"cover_image_alt" varchar(300) NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content"."blog_related_articles" (
	"article_slug" varchar(180) NOT NULL,
	"related_slug" varchar(180) NOT NULL,
	"position" integer NOT NULL,
	CONSTRAINT "blog_related_articles_article_slug_related_slug_pk" PRIMARY KEY("article_slug","related_slug")
);
--> statement-breakpoint
CREATE TABLE "content"."blog_sections" (
	"article_slug" varchar(180) NOT NULL,
	"position" integer NOT NULL,
	"heading" varchar(300) NOT NULL,
	"paragraphs" jsonb NOT NULL,
	"points" jsonb,
	"callout" text
);
--> statement-breakpoint
CREATE TABLE "content"."site_statistics" (
	"id" varchar(80) PRIMARY KEY NOT NULL,
	"label" varchar(120) NOT NULL,
	"value" varchar(80) NOT NULL,
	"icon" varchar(80) NOT NULL,
	"display_order" integer NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "content"."blog_related_articles" ADD CONSTRAINT "blog_related_articles_article_slug_blog_articles_slug_fk" FOREIGN KEY ("article_slug") REFERENCES "content"."blog_articles"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content"."blog_related_articles" ADD CONSTRAINT "blog_related_articles_related_slug_blog_articles_slug_fk" FOREIGN KEY ("related_slug") REFERENCES "content"."blog_articles"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content"."blog_sections" ADD CONSTRAINT "blog_sections_article_slug_blog_articles_slug_fk" FOREIGN KEY ("article_slug") REFERENCES "content"."blog_articles"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "blog_articles_published_index" ON "content"."blog_articles" USING btree ("is_published","published_at");--> statement-breakpoint
CREATE INDEX "blog_sections_article_index" ON "content"."blog_sections" USING btree ("article_slug","position");