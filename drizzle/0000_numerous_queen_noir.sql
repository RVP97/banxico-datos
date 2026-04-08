CREATE TABLE "data_points" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "data_points_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"series_id" text NOT NULL,
	"date" date NOT NULL,
	"value" numeric(20, 6) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "series" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"frequency" text,
	"unit" text,
	"last_synced_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "data_points" ADD CONSTRAINT "data_points_series_id_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uq_series_date" ON "data_points" USING btree ("series_id","date");--> statement-breakpoint
CREATE INDEX "idx_series_date_range" ON "data_points" USING btree ("series_id","date");