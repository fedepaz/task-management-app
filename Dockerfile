# You need to build from the root directory, not the backend directory
FROM node:20-slim AS builder
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl
RUN npm install -g pnpm

# Copy workspace files
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./

# Copy package files for all workspaces
COPY shared/package.json ./shared/
COPY backend/package.json ./backend/

# Install dependencies
RUN pnpm install

# Copy source files
COPY shared/ ./shared/
COPY backend/ ./backend/

# Build packages
RUN pnpm --filter @task-app/shared build
RUN pnpm --filter @task-app/backend build

FROM node:20-slim AS runner
WORKDIR /app
COPY --from=builder /app/shared/ ./shared/
COPY --from=builder /app/shared/package.json ./shared/
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/package.json ./

RUN npm install --global pnpm@9.12.3
RUN pnpm install --prod
CMD ["node", "dist/server.js"]