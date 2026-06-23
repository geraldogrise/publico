# Portal Corporativo

Projeto de portfolio **full-stack** construido com **Next.js (App Router)** e **TypeScript**, demonstrando autenticacao, dashboard protegido, camada de dados com Prisma e uma API REST documentada com Swagger.

## Visao geral

O Portal Corporativo simula uma plataforma interna onde usuarios autenticados acessam um **dashboard protegido** com metricas e a listagem de artigos. O conteudo (artigos, categorias e comentarios) e persistido em **SQLite via Prisma**, e toda a API e exposta como **Route Handlers REST** documentados em **OpenAPI / Swagger UI**.

## Stack e recursos

- **Next.js 15 (App Router)** — Server Components e Route Handlers.
- **TypeScript** em todo o projeto.
- **NextAuth (next-auth)** — provider `Credentials` com estrategia de sessao **JWT**.
- **Prisma + SQLite** — 4 entidades, seed e camada de acesso a dados desacoplada (repositorios + servicos).
- **Swagger / OpenAPI** — especificacao gerada com `next-swagger-doc`, servida em `/api/docs` e renderizada com **Swagger UI** em **`/api-docs`**.
- **CSS Modules + globals.css** (sem Tailwind), UI limpa.

## Arquitetura

```
src/
  app/
    api/
      auth/[...nextauth]/route.ts   # NextAuth (JWT, Credentials)
      posts/route.ts                # GET (lista) / POST (cria)
      posts/[id]/route.ts           # GET / PUT / DELETE
      categorias/route.ts           # GET
      comentarios/route.ts          # GET
      usuarios/route.ts             # GET (protegido por sessao)
      docs/route.ts                 # documento OpenAPI (JSON)
    api-docs/page.tsx               # Swagger UI
    dashboard/page.tsx              # rota protegida (Server Component)
    login/page.tsx                  # formulario de login
    page.tsx                        # home (Server Component)
  components/Providers.tsx          # SessionProvider
  lib/
    prisma.ts                       # singleton do Prisma Client
    auth.ts                         # configuracao do NextAuth
    swagger.ts                      # geracao do documento OpenAPI
  server/
    repositories/                   # acesso a dados (Prisma isolado)
    services/                       # regras de negocio (validacao, slug)
  middleware.ts                     # protege /dashboard
prisma/
  schema.prisma                     # modelos
  seed.ts                           # dados iniciais
```

A separacao **repositorios -> servicos -> route handlers / server components** segue principios de clean code/SOLID: as camadas superiores nao conhecem o Prisma.

## Entidades (Prisma)

- **Usuario** — `id, nome, email, senhaHash, papel (ADMIN|EDITOR|LEITOR)`. Relaciona-se com Posts e Comentarios.
- **Categoria** — `id, nome, slug, descricao`. Possui muitos Posts.
- **Post** (Artigo) — `id, titulo, slug, resumo, conteudo, publicado`. Pertence a um Usuario (autor) e opcionalmente a uma Categoria.
- **Comentario** — `id, conteudo`. Pertence a um Post e a um Usuario (autor).

## Protecao de rotas

A rota `/dashboard` e protegida de **duas formas**:

1. **Middleware** (`src/middleware.ts`) usando `next-auth/middleware` com matcher `"/dashboard/:path*"`.
2. **Checagem no Server Component** com `getServerSession` que redireciona para `/login` quando nao ha sessao.

## Credenciais de demonstracao

| Email           | Senha   | Papel  |
| --------------- | ------- | ------ |
| admin@demo.com  | 123456  | ADMIN  |
| editor@demo.com | 123456  | EDITOR |

## Como rodar

Pre-requisitos: Node 18+ (testado com Node 24) e npm.

1. Instale as dependencias:

   ```bash
   npm install
   ```

2. Garanta o arquivo `.env.local` (ja incluso). Caso precise recriar, copie de `.env.example` e defina `NEXTAUTH_SECRET`:

   ```bash
   cp .env.example .env.local
   ```

3. Crie o banco, aplique as migracoes e popule com o seed:

   ```bash
   npm run prisma:migrate   # cria o banco e a migracao inicial
   npm run prisma:seed      # popula com dados de demonstracao
   ```

   > Atalho: `npm run db:setup` executa migracao + seed.

4. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Acesse:
   - Aplicacao: <http://localhost:3000>
   - Login: <http://localhost:3000/login>
   - Dashboard (protegido): <http://localhost:3000/dashboard>
   - Documentacao da API: <http://localhost:3000/api-docs>

## Build de producao

```bash
npm run build   # executa "prisma generate" e depois "next build"
npm start       # sobe o servidor de producao
```

## Variaveis de ambiente

| Variavel          | Descricao                                  |
| ----------------- | ------------------------------------------ |
| `DATABASE_URL`    | Conexao SQLite (ex.: `file:./dev.db`)      |
| `NEXTAUTH_URL`    | URL base (`http://localhost:3000` em dev)  |
| `NEXTAUTH_SECRET` | Segredo usado para assinar os tokens JWT   |

## Endpoints da API

| Metodo | Rota                 | Descricao                       |
| ------ | -------------------- | ------------------------------- |
| GET    | `/api/posts`         | Lista posts                     |
| POST   | `/api/posts`         | Cria post                       |
| GET    | `/api/posts/{id}`    | Detalha post (com comentarios)  |
| PUT    | `/api/posts/{id}`    | Atualiza post                   |
| DELETE | `/api/posts/{id}`    | Remove post                     |
| GET    | `/api/categorias`    | Lista categorias                |
| GET    | `/api/comentarios`   | Lista comentarios               |
| GET    | `/api/usuarios`      | Lista usuarios (requer sessao)  |
| GET    | `/api/docs`          | Documento OpenAPI (JSON)        |

> O arquivo de banco (`*.db`) e ignorado pelo Git.

## Docker

```bash
docker compose up --build
# http://localhost:3000
```

O `Dockerfile` usa o **output standalone** do Next.js (imagem enxuta).

## Autenticação (3 modos)

- **Credentials (NextAuth):** login email/senha (`admin@demo.com` / `123456`), sessão JWT.
- **OAuth 2.0:** providers **GitHub** e **Google** habilitam-se automaticamente quando
  as variáveis `GITHUB_ID/GITHUB_SECRET` e/ou `GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET` existem (`.env.example`).
- **SAML 2.0:** Service Provider via `@node-saml/node-saml` com route handlers:
  - `GET /api/saml/login` → redireciona ao IdP (SSO)
  - `POST /api/saml/acs` → consome a asserção e cria sessão
  - `GET /api/saml/metadata` → metadados do SP (para registrar no IdP)
  - Configure `SAML_ENTRY_POINT` e `SAML_IDP_CERT` (ex.: IdP de teste https://samltest.id).

## Kubernetes

```bash
kubectl apply -f k8s/manifests.yaml
```

## CI/CD

- **GitHub Actions:** `.github/workflows/ci.yml` (build Next.js + build da imagem Docker)
- **GitLab CI:** `.gitlab-ci.yml`
