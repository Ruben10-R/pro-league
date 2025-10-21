# Base stage
FROM node:20-alpine AS base
WORKDIR /workspace
RUN apk add --no-cache curl

# Development stage
FROM base AS development
RUN npm install -g npm@latest
# Only copy what frontend actually needs
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY frontend/package*.json ./frontend/
RUN npm install
COPY . .
WORKDIR /workspace/frontend
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production
WORKDIR /workspace
# Only copy what's needed for production
COPY package*.json ./
COPY shared/ ./shared/
COPY frontend/ ./frontend/
RUN npm ci --workspaces --include-workspace-root --workspace=frontend --workspace=shared
RUN npm run build --workspace=shared
RUN npm run build --workspace=frontend
WORKDIR /workspace/frontend
EXPOSE 3000
CMD ["npm", "start"]
