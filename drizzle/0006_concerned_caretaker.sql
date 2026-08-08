CREATE TABLE "content"."user_favorites" (
	"user_id" uuid NOT NULL,
	"property_id" varchar(50) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_favorites_user_id_property_id_pk" PRIMARY KEY("user_id","property_id")
);
--> statement-breakpoint
ALTER TABLE "content"."user_favorites" ADD CONSTRAINT "user_favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content"."user_favorites" ADD CONSTRAINT "user_favorites_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "content"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_favorites_user_index" ON "content"."user_favorites" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_favorites_property_index" ON "content"."user_favorites" USING btree ("property_id");