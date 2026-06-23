import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('Iniciando seed...');

  const email = 'admin@demo.com';
  const passwordHash = await bcrypt.hash('123456', 10);

  // Usuario admin (idempotente)
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      id: randomUUID(),
      name: 'Administrador Demo',
      email,
      password: passwordHash,
    },
  });

  // Limpa dados anteriores do usuario para um seed consistente
  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  await prisma.budget.deleteMany({ where: { userId: user.id } });
  await prisma.goal.deleteMany({ where: { userId: user.id } });
  await prisma.tag.deleteMany({ where: { userId: user.id } });
  await prisma.account.deleteMany({ where: { userId: user.id } });
  await prisma.category.deleteMany({ where: { userId: user.id } });

  // Contas
  const conta = await prisma.account.create({
    data: {
      id: randomUUID(),
      name: 'Conta Corrente',
      type: 'CHECKING',
      initialBalance: 5000,
      userId: user.id,
    },
  });
  const carteira = await prisma.account.create({
    data: {
      id: randomUUID(),
      name: 'Carteira',
      type: 'WALLET',
      initialBalance: 300,
      userId: user.id,
    },
  });

  // Categorias
  const salario = await prisma.category.create({
    data: { id: randomUUID(), name: 'Salario', type: 'INCOME', color: '#22c55e', userId: user.id },
  });
  const alimentacao = await prisma.category.create({
    data: { id: randomUUID(), name: 'Alimentacao', type: 'EXPENSE', color: '#ef4444', userId: user.id },
  });
  const transporte = await prisma.category.create({
    data: { id: randomUUID(), name: 'Transporte', type: 'EXPENSE', color: '#f59e0b', userId: user.id },
  });
  const lazer = await prisma.category.create({
    data: { id: randomUUID(), name: 'Lazer', type: 'EXPENSE', color: '#8b5cf6', userId: user.id },
  });
  const moradia = await prisma.category.create({
    data: { id: randomUUID(), name: 'Moradia', type: 'EXPENSE', color: '#0ea5e9', userId: user.id },
  });

  // Tags
  const tagFixo = await prisma.tag.create({
    data: { id: randomUUID(), name: 'fixo', color: '#64748b', userId: user.id },
  });
  const tagEssencial = await prisma.tag.create({
    data: { id: randomUUID(), name: 'essencial', color: '#0d9488', userId: user.id },
  });

  const now = new Date();
  const day = (d: number) => new Date(now.getFullYear(), now.getMonth(), d);

  // Transacoes
  await prisma.transaction.create({
    data: {
      id: randomUUID(),
      description: 'Salario mensal',
      amount: 5000,
      type: 'INCOME',
      date: day(5),
      userId: user.id,
      accountId: conta.id,
      categoryId: salario.id,
      tags: { create: [{ tagId: tagFixo.id }] },
    },
  });
  await prisma.transaction.create({
    data: {
      id: randomUUID(),
      description: 'Aluguel',
      amount: 1500,
      type: 'EXPENSE',
      date: day(6),
      userId: user.id,
      accountId: conta.id,
      categoryId: moradia.id,
      tags: { create: [{ tagId: tagFixo.id }, { tagId: tagEssencial.id }] },
    },
  });
  await prisma.transaction.create({
    data: {
      id: randomUUID(),
      description: 'Supermercado',
      amount: 650.75,
      type: 'EXPENSE',
      date: day(8),
      userId: user.id,
      accountId: conta.id,
      categoryId: alimentacao.id,
      tags: { create: [{ tagId: tagEssencial.id }] },
    },
  });
  await prisma.transaction.create({
    data: {
      id: randomUUID(),
      description: 'Combustivel',
      amount: 280,
      type: 'EXPENSE',
      date: day(10),
      userId: user.id,
      accountId: conta.id,
      categoryId: transporte.id,
    },
  });
  await prisma.transaction.create({
    data: {
      id: randomUUID(),
      description: 'Cinema',
      amount: 90,
      type: 'EXPENSE',
      date: day(12),
      userId: user.id,
      accountId: carteira.id,
      categoryId: lazer.id,
    },
  });
  await prisma.transaction.create({
    data: {
      id: randomUUID(),
      description: 'Restaurante',
      amount: 130.5,
      type: 'EXPENSE',
      date: day(15),
      userId: user.id,
      accountId: carteira.id,
      categoryId: alimentacao.id,
    },
  });

  // Orcamentos
  await prisma.budget.create({
    data: {
      id: randomUUID(),
      amount: 1000,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      userId: user.id,
      categoryId: alimentacao.id,
    },
  });
  await prisma.budget.create({
    data: {
      id: randomUUID(),
      amount: 400,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      userId: user.id,
      categoryId: transporte.id,
    },
  });

  // Metas
  await prisma.goal.create({
    data: {
      id: randomUUID(),
      name: 'Reserva de emergencia',
      targetAmount: 15000,
      currentAmount: 4500,
      deadline: new Date(now.getFullYear() + 1, 11, 31),
      userId: user.id,
    },
  });
  await prisma.goal.create({
    data: {
      id: randomUUID(),
      name: 'Viagem de ferias',
      targetAmount: 6000,
      currentAmount: 1200,
      deadline: new Date(now.getFullYear(), now.getMonth() + 6, 1),
      userId: user.id,
    },
  });

  // eslint-disable-next-line no-console
  console.log('Seed concluido. Login: admin@demo.com / 123456');
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
