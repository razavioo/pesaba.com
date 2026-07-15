#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ -f .env.cms.local ]]; then
  set -a
  # Local credentials are intentionally ignored by Git.
  source .env.cms.local
  set +a
else
  export DATABASE_URL='postgresql://pesaba:pesaba-local-only@localhost:55432/pesaba_cms?schema=public'
  export CMS_API_PORT=4400
  export CMS_WEB_ORIGIN=http://localhost:3000
  export CMS_SESSION_SECRET='e2e-only-session-secret-must-be-at-least-32-characters'
  export CMS_S3_ENDPOINT=http://localhost:9000
  export CMS_S3_REGION=us-east-1
  export CMS_S3_BUCKET=pesaba-media
  export CMS_S3_ACCESS_KEY=pesaba-local
  export CMS_S3_SECRET_KEY=pesaba-local-only
  export CMS_S3_PUBLIC_URL=http://localhost:9000/pesaba-media
  export CMS_BOOTSTRAP_EMAIL=owner@pesaba.local
  export CMS_BOOTSTRAP_PASSWORD=PesabaLocalOwner-2026
  export CMS_BOOTSTRAP_NAME='مالک پنل'
fi

docker compose up -d
npm run cms:generate
npm --workspace @pesaba/cms-api run prisma:deploy
npm run cms:seed
npm --workspace @pesaba/cms-api run import:content
exec npm run dev:cms
