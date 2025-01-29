FROM node:20-slim AS builder
WORKDIR /app
RUN npm install -g pnpm

# Copy workspace config
COPY pnpm-workspace.yaml ./
COPY package.json ./

# Copy packages
COPY shared/ shared/
COPY backend/ backend/

# Install dependencies
RUN pnpm install

# Build shared and backend
RUN pnpm --filter @task-app/shared build
RUN pnpm --filter @task-app/backend build

FROM node:20-slim AS runner
WORKDIR /app
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/package.json ./
RUN npm install --production
CMD ["node", "dist/server.js"]