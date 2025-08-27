# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# Build Angular SSR (browser + server)
RUN npm run build

# ---- Runtime stage ----
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app

# Copy built SSR output
COPY --from=build /app/dist/my-app /app/dist/my-app

# Cloud Run injects PORT. Angular SSR server reads it.
EXPOSE 4200
CMD ["node", "dist/my-app/server/server.mjs"]