import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_product_a_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__product_a_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pages_sections_layout" AS ENUM('text', 'two-column', 'centered');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_sections_layout" AS ENUM('text', 'two-column', 'centered');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "_product_a_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_price" numeric,
  	"version_product_a_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__product_a_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "pages_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"content" varchar,
  	"layout" "enum_pages_sections_layout" DEFAULT 'text'
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"hero_heading" varchar DEFAULT 'Welcome to Our Store',
  	"hero_subheading" varchar DEFAULT 'Discover amazing products and great deals',
  	"hero_cta_text" varchar DEFAULT 'Shop Now',
  	"hero_cta_link" varchar DEFAULT '/products',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_pages_v_version_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"content" varchar,
  	"layout" "enum__pages_v_version_sections_layout" DEFAULT 'text',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_hero_heading" varchar DEFAULT 'Welcome to Our Store',
  	"version_hero_subheading" varchar DEFAULT 'Discover amazing products and great deals',
  	"version_hero_cta_text" varchar DEFAULT 'Shop Now',
  	"version_hero_cta_link" varchar DEFAULT '/products',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "product_a" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "product_a" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "product_a" ALTER COLUMN "description" DROP NOT NULL;
  ALTER TABLE "product_a" ALTER COLUMN "price" DROP NOT NULL;
  ALTER TABLE "product_a" ALTER COLUMN "product_a_image_id" DROP NOT NULL;
  ALTER TABLE "product_a" ADD COLUMN "_status" "enum_product_a_status" DEFAULT 'draft';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "_product_a_v" ADD CONSTRAINT "_product_a_v_parent_id_product_a_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."product_a"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_product_a_v" ADD CONSTRAINT "_product_a_v_version_product_a_image_id_media_id_fk" FOREIGN KEY ("version_product_a_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_sections" ADD CONSTRAINT "pages_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_sections" ADD CONSTRAINT "_pages_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "_product_a_v_parent_idx" ON "_product_a_v" USING btree ("parent_id");
  CREATE INDEX "_product_a_v_version_version_slug_idx" ON "_product_a_v" USING btree ("version_slug");
  CREATE INDEX "_product_a_v_version_version_product_a_image_idx" ON "_product_a_v" USING btree ("version_product_a_image_id");
  CREATE INDEX "_product_a_v_version_version_updated_at_idx" ON "_product_a_v" USING btree ("version_updated_at");
  CREATE INDEX "_product_a_v_version_version_created_at_idx" ON "_product_a_v" USING btree ("version_created_at");
  CREATE INDEX "_product_a_v_version_version__status_idx" ON "_product_a_v" USING btree ("version__status");
  CREATE INDEX "_product_a_v_created_at_idx" ON "_product_a_v" USING btree ("created_at");
  CREATE INDEX "_product_a_v_updated_at_idx" ON "_product_a_v" USING btree ("updated_at");
  CREATE INDEX "_product_a_v_latest_idx" ON "_product_a_v" USING btree ("latest");
  CREATE INDEX "pages_sections_order_idx" ON "pages_sections" USING btree ("_order");
  CREATE INDEX "pages_sections_parent_id_idx" ON "pages_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "_pages_v_version_sections_order_idx" ON "_pages_v_version_sections" USING btree ("_order");
  CREATE INDEX "_pages_v_version_sections_parent_id_idx" ON "_pages_v_version_sections" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "product_a__status_idx" ON "product_a" USING btree ("_status");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_product_a_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_product_a_v" CASCADE;
  DROP TABLE "pages_sections" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v_version_sections" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pages_fk";
  
  DROP INDEX "product_a__status_idx";
  DROP INDEX "payload_locked_documents_rels_pages_id_idx";
  ALTER TABLE "product_a" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "product_a" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "product_a" ALTER COLUMN "description" SET NOT NULL;
  ALTER TABLE "product_a" ALTER COLUMN "price" SET NOT NULL;
  ALTER TABLE "product_a" ALTER COLUMN "product_a_image_id" SET NOT NULL;
  ALTER TABLE "product_a" DROP COLUMN "_status";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pages_id";
  DROP TYPE "public"."enum_product_a_status";
  DROP TYPE "public"."enum__product_a_v_version_status";
  DROP TYPE "public"."enum_pages_sections_layout";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_sections_layout";
  DROP TYPE "public"."enum__pages_v_version_status";`)
}
