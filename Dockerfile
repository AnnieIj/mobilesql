# syntax=docker/dockerfile:1.4

# Stage 1: Base Dependencies
FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm ci

# Stage 2: Application Builder
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npx prisma generate
RUN npm run build

# Stage 3: Production Minimal Runner
FROM node:22-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 mobilesql

# Install runtime OpenSSL for Prisma
RUN apk add --no-cache openssl curl

COPY --from=builder --chown=mobilesql:nodejs /app/dist ./dist
COPY --from=builder --chown=mobilesql:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=mobilesql:nodejs /app/package.json ./package.json
COPY --from=builder --chown=mobilesql:nodejs /app/prisma ./prisma

USER mobilesql

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "dist/server.cjs"]
