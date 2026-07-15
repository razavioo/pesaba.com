-- CreateTable
CREATE TABLE "SettingRevision" (
    "id" UUID NOT NULL,
    "settingId" UUID NOT NULL,
    "actorId" UUID NOT NULL,
    "snapshot" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SettingRevision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SettingRevision_settingId_createdAt_idx" ON "SettingRevision"("settingId", "createdAt");

-- AddForeignKey
ALTER TABLE "SettingRevision" ADD CONSTRAINT "SettingRevision_settingId_fkey" FOREIGN KEY ("settingId") REFERENCES "SiteSetting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettingRevision" ADD CONSTRAINT "SettingRevision_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
