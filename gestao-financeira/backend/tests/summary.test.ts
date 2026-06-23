import request from 'supertest';
import { Application } from 'express';
import { buildTestApp } from './helpers/testApp';

describe('GET /api/summary', () => {
  let app: Application;
  let token: string;

  beforeAll(async () => {
    ({ app } = await buildTestApp());
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@demo.com', password: '123456' });
    token = login.body.token;

    const account = await request(app)
      .post('/api/accounts')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Conta', type: 'CHECKING', initialBalance: 1000 });
    const incomeCat = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Salario', type: 'INCOME' });
    const expenseCat = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Lazer', type: 'EXPENSE' });

    await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'Salario',
        amount: 2000,
        type: 'INCOME',
        accountId: account.body.id,
        categoryId: incomeCat.body.id,
      });
    await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'Show',
        amount: 300,
        type: 'EXPENSE',
        accountId: account.body.id,
        categoryId: expenseCat.body.id,
      });
  });

  it('deve calcular saldo, receitas, despesas e gastos por categoria', async () => {
    const res = await request(app).get('/api/summary').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    // saldo inicial 1000 + receita 2000 - despesa 300 = 2700
    expect(res.body.balance).toBe(2700);
    expect(res.body.totalIncome).toBe(2000);
    expect(res.body.totalExpense).toBe(300);
    expect(res.body.transactionCount).toBe(2);
    expect(res.body.spendingByCategory.length).toBe(1);
    expect(res.body.spendingByCategory[0].total).toBe(300);
  });
});
