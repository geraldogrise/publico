import request from 'supertest';
import { Application } from 'express';
import { buildTestApp } from './helpers/testApp';

describe('Fluxo de Transacoes', () => {
  let app: Application;
  let token: string;
  let accountId: string;
  let categoryId: string;

  beforeAll(async () => {
    ({ app } = await buildTestApp());
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@demo.com', password: '123456' });
    token = login.body.token;

    const account = await request(app)
      .post('/api/accounts')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Conta Teste', type: 'CHECKING', initialBalance: 1000 });
    accountId = account.body.id;

    const category = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Alimentacao', type: 'EXPENSE', color: '#ef4444' });
    categoryId = category.body.id;
  });

  it('deve exigir autenticacao para criar transacao', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .send({ description: 'x', amount: 10, type: 'EXPENSE', accountId, categoryId });
    expect(res.status).toBe(401);
  });

  it('deve criar e listar uma transacao', async () => {
    const create = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'Supermercado',
        amount: 150.5,
        type: 'EXPENSE',
        accountId,
        categoryId,
      });

    expect(create.status).toBe(201);
    expect(create.body.id).toBeDefined();
    expect(create.body.amount).toBe(150.5);
    expect(create.body.type).toBe('EXPENSE');

    const list = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${token}`);

    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body.length).toBeGreaterThanOrEqual(1);
    expect(list.body.some((t: { description: string }) => t.description === 'Supermercado')).toBe(
      true,
    );
  });

  it('deve rejeitar transacao com valor invalido (400)', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Invalida', amount: -5, type: 'EXPENSE', accountId, categoryId });
    expect(res.status).toBe(400);
  });
});
