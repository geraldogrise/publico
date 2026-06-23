# --- Build ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
COPY . .
RUN npm run build

# --- Runtime ---
FROM node:22-alpine AS final
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
COPY --from=build /app/dist ./dist
EXPOSE 3001
# Garante o schema no SQLite e sobe a API.
CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/main/server.js"]
