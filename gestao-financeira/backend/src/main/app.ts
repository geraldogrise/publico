import express, { Application } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { Container } from './container';
import { buildRoutes } from '../interfaces/http/routes';
import { errorMiddleware } from '../interfaces/http/middlewares/errorMiddleware';
import { openApiDocument } from '../interfaces/http/docs/openapi';

export interface CreateAppOptions {
  corsOrigin?: string;
}

/**
 * Cria a aplicacao Express a partir do container.
 * Funcao pura de montagem - usada tanto pelo server quanto pelos testes (supertest).
 */
export function createApp(container: Container, options: CreateAppOptions = {}): Application {
  const app = express();

  app.use(
    cors({
      origin: options.corsOrigin ?? 'http://localhost:5173',
      credentials: true,
    }),
  );
  app.use(express.json());

  // Documentacao Swagger
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
  app.get('/openapi.json', (_req, res) => res.json(openApiDocument));

  // Rotas da API
  app.use('/api', buildRoutes(container));

  // Health raiz (alem de /api/health)
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Tratamento de erros (deve ser o ultimo)
  app.use(errorMiddleware);

  return app;
}
