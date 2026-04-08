# syntax=docker/dockerfile:1

# ==========================================
# Stage 1: Dependencies
# ==========================================
FROM oven/bun:1.3.11-alpine AS deps

WORKDIR /app

COPY package.json bun.lock ./

RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile --ignore-scripts

# ==========================================
# Stage 2: Builder
# ==========================================
FROM oven/bun:1.3.11-alpine AS builder

WORKDIR /app

ARG BUILD_TIME
ARG BUILD_COMMIT

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN --mount=type=cache,target=/app/.next/cache \
    BUILD_START=$(date +%s) && \
    bun run build && \
    BUILD_END=$(date +%s) && \
    BUILD_DURATION=$((BUILD_END - BUILD_START)) && \
    echo "Build completed in ${BUILD_DURATION} seconds" && \
    echo "{\"buildTime\": \"${BUILD_TIME:-$(date -Iseconds)}\", \"buildCommit\": \"${BUILD_COMMIT:-unknown}\", \"buildDuration\": ${BUILD_DURATION}}" > .next/standalone/build-info.json

# ==========================================
# Stage 3: Production Runner
# ==========================================
FROM oven/bun:1.3.11-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME="0.0.0.0" \
    PORT=3000

ARG BUILD_TIME
ARG BUILD_COMMIT
ENV BUILD_TIME=${BUILD_TIME} \
    BUILD_COMMIT=${BUILD_COMMIT}

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --link --from=builder /app/public ./public

RUN mkdir -p .next && chown nextjs:nodejs .next

COPY --link --from=builder --chown=1001:1001 /app/.next/standalone ./
COPY --link --from=builder --chown=1001:1001 /app/.next/static ./.next/static

COPY --link --from=builder /app/drizzle ./drizzle
COPY --link --from=builder /app/drizzle.config.mjs ./drizzle.config.mjs

# Minimal deps for drizzle-kit migrate only (avoids installing full app tree)
RUN --mount=type=cache,target=/root/.bun/install/cache \
    echo '{"name":"migrate","private":true,"dependencies":{"drizzle-kit":"^0.31.10","drizzle-orm":"^0.45.2","pg":"^8.20.0"}}' > package.json && \
    bun install --ignore-scripts

RUN chown -R nextjs:nodejs /app/drizzle /app/drizzle.config.mjs /app/package.json /app/node_modules

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:3000/').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# Run migrations then start the app (DATABASE_URL must be set at runtime)
CMD ["sh", "-c", "bunx drizzle-kit migrate --config=drizzle.config.mjs && exec node server.js"]
