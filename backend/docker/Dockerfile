# Base stage
FROM node:20-alpine AS base
WORKDIR /workspace
RUN apk add --no-cache curl

# Development stage
FROM base AS development
RUN npm install -g npm@latest
# Only copy what backend actually needs
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY backend/package*.json ./backend/
RUN npm install
COPY . .
WORKDIR /workspace/backend
EXPOSE 3333
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production
WORKDIR /workspace
# Only copy what's needed for production
COPY package*.json ./
COPY shared/ ./shared/
COPY backend/ ./backend/
RUN npm ci --workspaces --include-workspace-root --workspace=backend --workspace=shared
RUN npm run build --workspace=shared
RUN npm run build --workspace=backend
WORKDIR /workspace/backend
EXPOSE 3333
CMD ["npm", "start"]
