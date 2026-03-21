# syntax=docker/dockerfile:1.7

# Base
FROM node:20-alpine AS base
WORKDIR /app

# Dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm npm ci

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production dependencies only
FROM base AS prod-deps
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

# Runner
FROM node:20-alpine AS runner

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 medusa

WORKDIR /app

COPY --from=prod-deps --chown=medusa:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=medusa:nodejs /app/.medusa ./.medusa
COPY --from=builder --chown=medusa:nodejs /app/package.json ./package.json
COPY --from=builder --chown=medusa:nodejs /app/medusa-config.ts ./medusa-config.ts
COPY --from=builder --chown=medusa:nodejs /app/tsconfig.json ./tsconfig.json
COPY --from=builder --chown=medusa:nodejs /app/src ./src
COPY --from=builder --chown=medusa:nodejs /app/.medusa/server/public ./public

RUN mkdir -p /app/static && chown medusa:nodejs /app/static

USER medusa

EXPOSE 9000

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=5 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:9000/health || exit 1

CMD ["npm", "run", "start"]
