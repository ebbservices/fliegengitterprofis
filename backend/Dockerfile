# Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
ENV DATABASE_URL=postgres://localhost/fake \
    STORE_CORS=http://localhost \
    ADMIN_CORS=http://localhost \
    AUTH_CORS=http://localhost \
    JWT_SECRET=build-placeholder \
    COOKIE_SECRET=build-placeholder
RUN npm run build && mkdir -p .medusa/server/public

# Production
FROM node:20-alpine AS runner

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 medusa

WORKDIR /app

COPY --from=builder --chown=medusa:nodejs /app/.medusa ./.medusa
COPY --from=builder --chown=medusa:nodejs /app/node_modules ./node_modules
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
