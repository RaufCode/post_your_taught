# Production stage
FROM node:20-alpine

WORKDIR /app

# Install dependencies (including devDependencies for tsx)
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm db:generate

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the server using tsx (handles TypeScript directly)
CMD ["npx", "tsx", "server.ts"]
