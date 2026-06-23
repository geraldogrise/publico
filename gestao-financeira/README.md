# 💰 Gestão Financeira Pessoal

Aplicação **full-stack** de controle financeiro: contas, transações, categorias, orçamentos e metas,
com dashboard e gráficos. Back-end em **Node.js/Express + TypeScript** seguindo
**Arquitetura Hexagonal (Ports & Adapters) + DDD + Clean Architecture + SOLID**, e
front-end em **React + Vite**.

## 🧩 Stack

| Camada | Tecnologias |
|--------|-------------|
| Backend | Node.js, Express, TypeScript, Prisma + SQLite |
| Arquitetura | Hexagonal · DDD · Clean Architecture · SOLID |
| Auth | JWT (`jsonwebtoken`) + middleware de autenticação |
| API Docs | OpenAPI / Swagger em **`/docs`** |
| Frontend | React, Vite, TypeScript, Recharts, formatação BRL |
| Testes | Jest + supertest — **cobertura ≥ 70%** (`coverageThreshold`) |

## 🧱 Arquitetura (backend)

```
src/
├─ domain/          # Entidades, Value Objects, Ports (interfaces de repositório)
├─ application/     # Casos de uso, DTOs, serviços de aplicação
├─ infrastructure/  # Adapters: Prisma (SQLite), segurança (JWT/bcrypt)
├─ interfaces/http/ # Controllers, rotas, middlewares, validação (zod)
└─ main/            # Composition root (injeção de dependências) + server
```

## 🗃️ Entidades (10 modelos Prisma)

`User`, `Account`, `Category`, `Transaction`, `Budget`, `Goal`, `Tag`,
`TagsOnTransactions`, `RecurringTransaction`, `Bill`.

## ▶️ Como rodar

### Backend (porta 3001)
```bash
cd backend
npm install
npm run db:setup     # cria o schema SQLite + seed
npm run dev          # API em http://localhost:3001  (Swagger: /docs)
```

### Frontend (porta 5173)
```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

### Testes + cobertura
```bash
cd backend
npm run test:coverage
```

## 🔐 Credenciais demo
`admin@demo.com` / `123456`

## 🐳 Docker
```bash
docker compose up --build
# API:      http://localhost:3001/docs
# Frontend: http://localhost:5173
```

## ☸️ Kubernetes
```bash
kubectl apply -f k8s/manifests.yaml
```

## ⚙️ CI
- **GitHub Actions:** `.github/workflows/ci.yml`
- **GitLab CI:** `.gitlab-ci.yml`
