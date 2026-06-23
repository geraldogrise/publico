/** Documento OpenAPI 3.0 da API de Gestao Financeira. Servido em /docs. */
export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'API de Gestao Financeira Pessoal',
    version: '1.0.0',
    description:
      'API REST para controle de contas, transacoes, orcamentos e metas. ' +
      'Arquitetura Hexagonal + DDD + Clean Architecture. Autenticacao via JWT.',
  },
  servers: [{ url: 'http://localhost:3001/api', description: 'Servidor local' }],
  tags: [
    { name: 'Auth', description: 'Autenticacao' },
    { name: 'Accounts', description: 'Contas' },
    { name: 'Categories', description: 'Categorias' },
    { name: 'Transactions', description: 'Transacoes' },
    { name: 'Budgets', description: 'Orcamentos' },
    { name: 'Goals', description: 'Metas' },
    { name: 'Summary', description: 'Resumo financeiro' },
    { name: 'System', description: 'Sistema' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'admin@demo.com' },
          password: { type: 'string', example: '123456' },
        },
      },
      AuthOutput: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
            },
          },
        },
      },
      Account: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          type: {
            type: 'string',
            enum: ['CHECKING', 'SAVINGS', 'WALLET', 'CREDIT_CARD', 'INVESTMENT'],
          },
          initialBalance: { type: 'number' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      AccountInput: {
        type: 'object',
        required: ['name', 'type'],
        properties: {
          name: { type: 'string', example: 'Conta Corrente' },
          type: {
            type: 'string',
            enum: ['CHECKING', 'SAVINGS', 'WALLET', 'CREDIT_CARD', 'INVESTMENT'],
          },
          initialBalance: { type: 'number', example: 1000 },
        },
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
          color: { type: 'string' },
          icon: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      CategoryInput: {
        type: 'object',
        required: ['name', 'type'],
        properties: {
          name: { type: 'string', example: 'Alimentacao' },
          type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
          color: { type: 'string', example: '#ef4444' },
          icon: { type: 'string', nullable: true },
        },
      },
      Transaction: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          amount: { type: 'number' },
          type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
          date: { type: 'string', format: 'date-time' },
          accountId: { type: 'string' },
          categoryId: { type: 'string' },
          tagIds: { type: 'array', items: { type: 'string' } },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      TransactionInput: {
        type: 'object',
        required: ['description', 'amount', 'type', 'accountId', 'categoryId'],
        properties: {
          description: { type: 'string', example: 'Supermercado' },
          amount: { type: 'number', example: 150.5 },
          type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
          date: { type: 'string', format: 'date-time' },
          accountId: { type: 'string' },
          categoryId: { type: 'string' },
          tagIds: { type: 'array', items: { type: 'string' } },
        },
      },
      Budget: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          amount: { type: 'number' },
          month: { type: 'integer' },
          year: { type: 'integer' },
          categoryId: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      BudgetInput: {
        type: 'object',
        required: ['amount', 'month', 'year', 'categoryId'],
        properties: {
          amount: { type: 'number', example: 800 },
          month: { type: 'integer', example: 6 },
          year: { type: 'integer', example: 2026 },
          categoryId: { type: 'string' },
        },
      },
      Goal: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          targetAmount: { type: 'number' },
          currentAmount: { type: 'number' },
          progress: { type: 'number' },
          deadline: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      GoalInput: {
        type: 'object',
        required: ['name', 'targetAmount'],
        properties: {
          name: { type: 'string', example: 'Reserva de emergencia' },
          targetAmount: { type: 'number', example: 10000 },
          currentAmount: { type: 'number', example: 2500 },
          deadline: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      Summary: {
        type: 'object',
        properties: {
          balance: { type: 'number' },
          totalIncome: { type: 'number' },
          totalExpense: { type: 'number' },
          transactionCount: { type: 'integer' },
          spendingByCategory: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                categoryId: { type: 'string' },
                categoryName: { type: 'string' },
                color: { type: 'string' },
                total: { type: 'number' },
              },
            },
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Health check',
        security: [],
        responses: { '200': { description: 'API saudavel' } },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login e emissao de JWT',
        security: [],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } } },
        },
        responses: {
          '200': {
            description: 'Autenticado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthOutput' } } },
          },
          '401': { description: 'Credenciais invalidas' },
        },
      },
    },
    '/accounts': {
      get: {
        tags: ['Accounts'],
        summary: 'Listar contas',
        responses: {
          '200': {
            description: 'Lista de contas',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Account' } },
              },
            },
          },
        },
      },
      post: {
        tags: ['Accounts'],
        summary: 'Criar conta',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AccountInput' } } },
        },
        responses: { '201': { description: 'Conta criada' } },
      },
    },
    '/accounts/{id}': {
      get: {
        tags: ['Accounts'],
        summary: 'Obter conta',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Conta' }, '404': { description: 'Nao encontrada' } },
      },
      put: {
        tags: ['Accounts'],
        summary: 'Atualizar conta',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AccountInput' } } },
        },
        responses: { '200': { description: 'Atualizada' } },
      },
      delete: {
        tags: ['Accounts'],
        summary: 'Remover conta',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Removida' } },
      },
    },
    '/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Listar categorias',
        responses: { '200': { description: 'Lista de categorias' } },
      },
      post: {
        tags: ['Categories'],
        summary: 'Criar categoria',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoryInput' } } },
        },
        responses: { '201': { description: 'Categoria criada' } },
      },
    },
    '/categories/{id}': {
      put: {
        tags: ['Categories'],
        summary: 'Atualizar categoria',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoryInput' } } },
        },
        responses: { '200': { description: 'Atualizada' } },
      },
      delete: {
        tags: ['Categories'],
        summary: 'Remover categoria',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Removida' } },
      },
    },
    '/transactions': {
      get: {
        tags: ['Transactions'],
        summary: 'Listar transacoes',
        parameters: [
          { name: 'accountId', in: 'query', schema: { type: 'string' } },
          { name: 'categoryId', in: 'query', schema: { type: 'string' } },
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['INCOME', 'EXPENSE'] } },
          { name: 'from', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'to', in: 'query', schema: { type: 'string', format: 'date' } },
        ],
        responses: {
          '200': {
            description: 'Lista de transacoes',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Transaction' } },
              },
            },
          },
        },
      },
      post: {
        tags: ['Transactions'],
        summary: 'Criar transacao',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/TransactionInput' } },
          },
        },
        responses: { '201': { description: 'Transacao criada' } },
      },
    },
    '/transactions/{id}': {
      get: {
        tags: ['Transactions'],
        summary: 'Obter transacao',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Transacao' } },
      },
      put: {
        tags: ['Transactions'],
        summary: 'Atualizar transacao',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/TransactionInput' } },
          },
        },
        responses: { '200': { description: 'Atualizada' } },
      },
      delete: {
        tags: ['Transactions'],
        summary: 'Remover transacao',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Removida' } },
      },
    },
    '/budgets': {
      get: { tags: ['Budgets'], summary: 'Listar orcamentos', responses: { '200': { description: 'Lista' } } },
      post: {
        tags: ['Budgets'],
        summary: 'Criar orcamento',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/BudgetInput' } } },
        },
        responses: { '201': { description: 'Orcamento criado' } },
      },
    },
    '/budgets/{id}': {
      put: {
        tags: ['Budgets'],
        summary: 'Atualizar orcamento',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: { 'application/json': { schema: { $ref: '#/components/schemas/BudgetInput' } } },
        },
        responses: { '200': { description: 'Atualizado' } },
      },
      delete: {
        tags: ['Budgets'],
        summary: 'Remover orcamento',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Removido' } },
      },
    },
    '/goals': {
      get: { tags: ['Goals'], summary: 'Listar metas', responses: { '200': { description: 'Lista' } } },
      post: {
        tags: ['Goals'],
        summary: 'Criar meta',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/GoalInput' } } },
        },
        responses: { '201': { description: 'Meta criada' } },
      },
    },
    '/goals/{id}': {
      put: {
        tags: ['Goals'],
        summary: 'Atualizar meta',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: { 'application/json': { schema: { $ref: '#/components/schemas/GoalInput' } } },
        },
        responses: { '200': { description: 'Atualizada' } },
      },
      delete: {
        tags: ['Goals'],
        summary: 'Remover meta',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Removida' } },
      },
    },
    '/summary': {
      get: {
        tags: ['Summary'],
        summary: 'Resumo financeiro (saldo, receitas, despesas, gastos por categoria)',
        parameters: [
          { name: 'from', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'to', in: 'query', schema: { type: 'string', format: 'date' } },
        ],
        responses: {
          '200': {
            description: 'Resumo',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Summary' } } },
          },
        },
      },
    },
  },
};
