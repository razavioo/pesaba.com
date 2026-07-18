ALTER TABLE "SiteSetting"
  ADD COLUMN "publicationState" "PublicationState" NOT NULL DEFAULT 'DRAFT',
  ADD COLUMN "publishedRevisionId" UUID;

UPDATE "SiteSetting"
SET "publicationState" = 'PUBLISHED'::"PublicationState";
