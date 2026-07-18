CREATE TABLE "AiProviderConfig" (
  "id" UUID NOT NULL,
  "name" VARCHAR(120) NOT NULL,
  "provider" VARCHAR(40) NOT NULL,
  "baseUrl" VARCHAR(500) NOT NULL,
  "apiKeyEncrypted" TEXT NOT NULL,
  "model" VARCHAR(240) NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AiProviderConfig_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AiProviderConfig_enabled_isDefault_idx" ON "AiProviderConfig"("enabled", "isDefault");
