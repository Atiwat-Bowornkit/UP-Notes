# Multi-Stage Dockerfile for UP-Notes Platform (Next.js / Node.js)

# Stage 1: Build Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package manifests for layer caching
COPY package.json ./
RUN npm install --only=production

# Stage 2: Production Runtime Image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Security Best Practice: Create and run as non-root user (ESP §7)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy dependencies and application source code
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Change ownership to non-root user
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

EXPOSE 3000

# Health check (Stretch Goal)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "prototypes/sprint1/Tanawan_Login.js"]
