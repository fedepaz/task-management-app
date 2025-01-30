# You need to build from the root directory, not the backend directory
FROM node:20-slim AS builder
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl
RUN npm install -g pnpm@9.12.3

# Copy workspace files
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./

# Verifica los archivos copiados
RUN ls -a

# Copy package files for all workspaces
COPY shared/package.json ./shared/
COPY backend/package.json ./backend/

# Verifica los archivos copiados en los workspaces
RUN ls -a shared
RUN ls -a backend

# Install dependencies
RUN pnpm install

# Copy source files
COPY shared/ ./shared/
COPY backend/ ./backend/

# Verifica los archivos copiados después de la instalación de dependencias
RUN ls -a shared
RUN ls -a backend

# Build packages
RUN pnpm --filter @task-app/shared build
RUN pnpm --filter @task-app/backend build

# Verifica los archivos generados después de la construcción
RUN ls -a shared/dist
RUN ls -a backend/dist

FROM node:20-slim AS runner
WORKDIR /app

# Copia los archivos necesarios desde el builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/shared/package.json ./shared/
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/backend/package.json ./
COPY --from=builder /app/backend/dist ./

# Verifica los archivos copiados en la etapa final
RUN ls -a
RUN ls -a shared
RUN ls -a shared/dist
RUN ls -a shared/dist/validation

# Instala pnpm y dependencias de producción
RUN npm install --global pnpm@9.12.3
RUN pnpm install --prod

RUN apt-get update -y && apt-get install -y openssl

# Comando para ejecutar la aplicación
CMD ["node", "server.js"]