# You need to build from the root directory, not the backend directory
FROM node:20-slim AS builder
WORKDIR /app

RUN npm install -g pnpm

# Copy workspace files
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./

# Copy package files for all workspaces
COPY shared/package.json ./shared/
COPY backend/package.json ./backend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY shared/ ./shared/
COPY backend/ ./backend/

# Build packages
RUN pnpm --filter @task-app/shared build
RUN pnpm --filter @task-app/backend build

FROM node:20-slim AS runner
WORKDIR /app
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/package.json ./
RUN npm install --production --frozen-lockfile
CMD ["node", "dist/server.js"]