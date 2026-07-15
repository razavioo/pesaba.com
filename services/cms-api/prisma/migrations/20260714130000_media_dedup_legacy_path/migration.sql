ALTER TABLE "MediaAsset" ADD COLUMN "checksum" TEXT;
ALTER TABLE "MediaAsset" ADD COLUMN "sourcePath" TEXT;
CREATE UNIQUE INDEX "MediaAsset_checksum_key" ON "MediaAsset"("checksum");
CREATE UNIQUE INDEX "MediaAsset_sourcePath_key" ON "MediaAsset"("sourcePath");
