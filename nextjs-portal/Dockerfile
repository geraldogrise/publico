# --- Build ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build

# --- Runtime (Next standalone) ---
FROM node:22-alpine AS final
WORKDIR /app
ENV NODE_ENV=production
ENV NEXTAUTH_URL=http://localhost:3000
ENV NEXTAUTH_SECRET=troque-em-producao-com-um-segredo-forte
ENV DATABASE_URL=file:./dev.db

COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000
# Cria o schema SQLite e sobe o servidor standalone.
CMD ["sh", "-c", "npx --yes prisma db push --skip-generate || true; node server.js"]
