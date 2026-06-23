import request from 'supertest';
import { Application } from 'express';
import { buildTestApp } from './helpers/testApp';

describe('POST /api/auth/login', () => {
  let app: Application;

  beforeAll(async () => {
    ({ app } = await buildTestApp());
  });

  it('deve autenticar com credenciais validas e retornar token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@demo.com', password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(typeof res.body.token).toBe('string');
    expect(res.body.user.email).toBe('admin@demo.com');
  });

  it('deve rejeitar credenciais invalidas com 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@demo.com', password: 'errada' });

    expect(res.status).toBe(401);
  });

  it('deve rejeitar payload invalido com 400', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'nao-email' });
    expect(res.status).toBe(400);
  });
});
