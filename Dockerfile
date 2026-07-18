FROM node:22-bookworm-slim AS build

WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
COPY services/cms-api/package.json services/cms-api/package.json
COPY modules/cms-contracts/package.json modules/cms-contracts/package.json
RUN npm ci
COPY . .
RUN npm --workspace @pesaba/cms-api run prisma:generate
# Secret scanning relies on Git's tracked-file enumeration and is run in CI;
# image builds have no .git metadata and Compose contains intentional local
# development credentials. Keep content validation and both application builds
# in the image build itself.
RUN npm run validate:content && npm run build:web && npm run build:cms

FROM node:22-bookworm-slim AS web

ENV NODE_ENV=production \
    NITRO_HOST=0.0.0.0 \
    NITRO_PORT=3000

WORKDIR /app
COPY --from=build --chown=node:node /app/.output ./.output

USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.NITRO_PORT||3000)+'/api/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["node", ".output/server/index.mjs"]

# Keep the CMS runtime separate from the public web runtime. Its dependencies
# include native modules (argon2 and sharp), so they are built once in `build`
# and copied into the matching Debian-based runtime image.
FROM node:22-bookworm-slim AS cms

ENV NODE_ENV=production \
    CMS_API_PORT=4000

WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/modules/cms-contracts ./modules/cms-contracts
COPY --from=build --chown=node:node /app/services/cms-api/dist ./services/cms-api/dist
COPY --from=build --chown=node:node /app/services/cms-api/prisma ./services/cms-api/prisma

USER node
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.CMS_API_PORT||4000)+'/api/v1/public/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["node", "services/cms-api/dist/main.js"]

# Migration image intentionally retains the Prisma CLI from the build stage.
# Compose runs it as a one-shot job before starting the CMS API.
FROM cms AS cms-migrate

USER root
COPY --from=build --chown=node:node /app/services/cms-api/package.json ./services/cms-api/package.json
USER node
CMD ["node_modules/.bin/prisma", "migrate", "deploy", "--schema", "services/cms-api/prisma/schema.prisma"]
