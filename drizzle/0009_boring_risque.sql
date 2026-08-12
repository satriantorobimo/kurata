ALTER TABLE "content"."properties" ADD COLUMN "sales_id" varchar(50);--> statement-breakpoint
ALTER TABLE "content"."properties" ADD CONSTRAINT "properties_sales_id_sales_id_fk" FOREIGN KEY ("sales_id") REFERENCES "content"."sales"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "properties_sales_id_index" ON "content"."properties" USING btree ("sales_id");