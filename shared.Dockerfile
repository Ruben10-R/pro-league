FROM node:20-alpine AS development
WORKDIR /workspace
RUN npm install -g npm@latest
# Shared only needs root workspace config and its own package.json
COPY package*.json ./
COPY shared/package*.json ./shared/
RUN npm install
COPY . .
# Initial build
RUN npm run build --workspace=shared
WORKDIR /workspace/shared
# Watch mode for development
CMD ["npm", "run", "build:watch"]
