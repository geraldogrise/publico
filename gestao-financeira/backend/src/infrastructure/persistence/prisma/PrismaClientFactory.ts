import { PrismaClient } from '@prisma/client';

/**
 * Factory/Singleton do PrismaClient (DbContext da infraestrutura).
 * Permite injetar URL alternativa (ex.: banco de teste).
 */
let instance: PrismaClient | null = null;

export function getPrismaClient(databaseUrl?: string): PrismaClient {
  if (databaseUrl) {
    return new PrismaClient({
      datasources: { db: { url: databaseUrl } },
    });
  }
  if (!instance) {
    instance = new PrismaClient();
  }
  return instance;
}
