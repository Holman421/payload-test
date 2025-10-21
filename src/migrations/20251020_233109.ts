import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_sections_type" AS ENUM('content', 'products');
  CREATE TYPE "public"."enum_pages_sections_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_version_sections_type" AS ENUM('content', 'products');
  CREATE TYPE "public"."enum__pages_v_version_sections_columns" AS ENUM('2', '3', '4');
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"product_a_id" integer
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"product_a_id" integer
  );
  
  ALTER TABLE "pages_sections" ADD COLUMN "type" "enum_pages_sections_type" DEFAULT 'content';
  ALTER TABLE "pages_sections" ADD COLUMN "columns" "enum_pages_sections_columns" DEFAULT '3';
  ALTER TABLE "_pages_v_version_sections" ADD COLUMN "type" "enum__pages_v_version_sections_type" DEFAULT 'content';
  ALTER TABLE "_pages_v_version_sections" ADD COLUMN "columns" "enum__pages_v_version_sections_columns" DEFAULT '3';
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_product_a_fk" FOREIGN KEY ("product_a_id") REFERENCES "public"."product_a"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_product_a_fk" FOREIGN KEY ("product_a_id") REFERENCES "public"."product_a"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_product_a_id_idx" ON "pages_rels" USING btree ("product_a_id");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_product_a_id_idx" ON "_pages_v_rels" USING btree ("product_a_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  ALTER TABLE "pages_sections" DROP COLUMN "type";
  ALTER TABLE "pages_sections" DROP COLUMN "columns";
  ALTER TABLE "_pages_v_version_sections" DROP COLUMN "type";
  ALTER TABLE "_pages_v_version_sections" DROP COLUMN "columns";
  DROP TYPE "public"."enum_pages_sections_type";
  DROP TYPE "public"."enum_pages_sections_columns";
  DROP TYPE "public"."enum__pages_v_version_sections_type";
  DROP TYPE "public"."enum__pages_v_version_sections_columns";`)
}
