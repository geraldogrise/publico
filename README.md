# Portfólio de Projetos Full-Stack

Coleção de aplicações demonstrando **TypeScript, Angular, React, Next.js, Node.js e .NET Core**,
com **Arquitetura Hexagonal, DDD, Clean Architecture e SOLID**, autenticação
**JWT / NextAuth**, **GraphQL**, documentação **OpenAPI/Swagger**, testes automatizados
**(Jest e xUnit, meta de 70% de cobertura)** e **DevOps** (Docker, docker-compose, CI no
GitHub Actions e GitLab CI).

---

## 🗂️ Projetos

### 1. [`gestao-projetos`](./gestao-projetos) — Gestão de Projetos (Kanban)
- **Front:** Angular 20 (standalone, signals, Reactive Forms, AuthGuard, interceptor JWT)
- **Back:** .NET 9 — Hexagonal + DDD + Clean Architecture (Domain / Application / Infrastructure / Api)
- **Banco:** EF Core + SQLite — 9 entidades
- JWT · Swagger (`/swagger`) · **xUnit** (cobertura ~76%)

### 2. [`gestao-financeira`](./gestao-financeira) — Gestão Financeira Pessoal
- **Front:** React + Vite + TypeScript (Recharts, BRL)
- **Back:** Node.js + Express + TypeScript — Hexagonal + DDD + Clean Architecture
- **Banco:** Prisma + SQLite — 10 modelos
- JWT · Swagger (`/docs`) · **Jest** (cobertura ≥70%)

### 3. [`nextjs-portal`](./nextjs-portal) — Portal Corporativo
- **Stack:** Next.js (App Router) + TypeScript, Server Components e Route Handlers
- **Auth:** NextAuth (Credentials, sessão JWT) + rota protegida `/dashboard`
- **Banco:** Prisma + SQLite · Swagger/OpenAPI em `/api-docs`

### 4. [`cinegraph`](./cinegraph) — Catálogo de Filmes (GraphQL) 🎬
- **Back:** .NET 9 + **HotChocolate (GraphQL)**, EF Core + SQLite, JWT
- **Front:** React + Vite + **urql** (cliente GraphQL real)
- **xUnit** (cobertura ~93%)

---

## 🧱 Conceitos demonstrados

| Categoria | Tecnologias / Práticas |
|-----------|------------------------|
| Linguagens | TypeScript, C#, SQL |
| Front-end | Angular 20, React 18, Next.js (App Router) |
| Back-end | .NET 9, Node.js/Express |
| APIs | REST (OpenAPI/Swagger) e **GraphQL** (HotChocolate) |
| Arquitetura | Hexagonal (Ports & Adapters), DDD, Clean Architecture, SOLID, Clean Code |
| Auth | JWT, NextAuth, **OAuth 2.0 (GitHub/Google)**, **SAML 2.0**, AuthGuard/Interceptors, `[Authorize]` |
| Persistência | EF Core (SQLite / **MSSQL**), Prisma + SQLite |
| Testes | xUnit, Jest, supertest — meta de 70% de cobertura |
| DevOps | Docker, docker-compose, **Kubernetes**, GitHub Actions, GitLab CI |

---

## ▶️ Execução rápida

Cada projeto tem o seu próprio `README.md` com instruções detalhadas. Resumo das portas:

| Projeto | Back-end | Front-end | Docs API |
|---------|----------|-----------|----------|
| gestao-projetos | `:5000` | `:4200` | `/swagger` |
| gestao-financeira | `:3001` | `:5173` | `/docs` |
| nextjs-portal | `:3000` | (mesmo app) | `/api-docs` |
| cinegraph | `:5245` | `:5174` | `/graphql` |

**Credenciais demo (todos):** `admin@demo.com` / `123456`

Com Docker, dentro de cada projeto:
```bash
docker compose up --build
```

---

## ⚙️ CI/CD

Cada projeto inclui **GitHub Actions** (`.github/workflows/ci.yml`) e **GitLab CI**
(`.gitlab-ci.yml`) com estágios de build, testes (cobertura) e build das imagens Docker.

> Projetos de demonstração — dados em SQLite local com seed. Foco em arquitetura,
> boas práticas, integração front-end ↔ back-end e DevOps.
