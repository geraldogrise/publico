import { config } from './config';
import { getPrismaClient } from '../infrastructure/persistence/prisma/PrismaClientFactory';
import { buildContainer } from './container';
import { createApp } from './app';

/** Entry-point (composition root de execucao). */
async function bootstrap(): Promise<void> {
  const prisma = getPrismaClient();
  const container = buildContainer(prisma, {
    jwtSecret: config.jwtSecret,
    jwtExpiresIn: config.jwtExpiresIn,
  });
  const app = createApp(container, { corsOrigin: config.corsOrigin });

  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`API rodando em http://localhost:${config.port}`);
    // eslint-disable-next-line no-console
    console.log(`Swagger em http://localhost:${config.port}/docs`);
  });
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Falha ao iniciar o servidor:', err);
  process.exit(1);
});
