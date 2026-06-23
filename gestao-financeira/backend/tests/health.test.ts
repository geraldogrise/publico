import request from 'supertest';
import { Application } from 'express';
import { buildTestApp } from './helpers/testApp';

describe('GET /api/health', () => {
  let app: Application;

  beforeAll(async () => {
    ({ app } = await buildTestApp());
  });

  it('deve retornar status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });
});
