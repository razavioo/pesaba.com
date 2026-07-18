-- Keep the v1 fields during the cutover.  V2 stores typed blocks separately
-- and does not reinterpret legacy editor JSON as public content.
CREATE TYPE "PublicationState" AS ENUM ('DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED');

ALTER TABLE "ContentItem"
  ADD COLUMN "publicationState" "PublicationState" NOT NULL DEFAULT 'DRAFT',
  ADD COLUMN "pageFamily" VARCHAR(80) NOT NULL DEFAULT 'landing_standard',
  ADD COLUMN "variant" VARCHAR(80) NOT NULL DEFAULT 'standard',
  ADD COLUMN "publishedRevisionId" UUID;

ALTER TABLE "ContentTranslation"
  ADD COLUMN "blocks" JSONB NOT NULL DEFAULT '[]';

-- Existing active entries remain available through v1.  Marking them as
-- published preserves the current site while a deliberate v2 migration turns
-- their legacy content into reviewed block records.
UPDATE "ContentItem"
SET "publicationState" = CASE
  WHEN "status" = 'ARCHIVED' THEN 'ARCHIVED'::"PublicationState"
  WHEN "status" = 'ACTIVE' THEN 'PUBLISHED'::"PublicationState"
  ELSE 'DRAFT'::"PublicationState"
END;

CREATE INDEX "ContentItem_type_publicationState_sortOrder_idx"
  ON "ContentItem"("type", "publicationState", "sortOrder");
