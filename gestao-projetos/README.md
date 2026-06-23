# Gestao de Projetos (Kanban)

Sistema full-stack de **gestao de projetos** no estilo Jira/Trello simplificado.
Permite organizar projetos, equipes, sprints e tarefas em um **board Kanban**
com colunas por status (Backlog, A Fazer, Em Andamento, Concluido), prioridades,
etiquetas e comentarios.

Projeto de portfolio que demonstra **Arquitetura Hexagonal (Ports & Adapters)**,
**DDD**, **Clean Architecture** e **SOLID** no backend .NET 9, e um frontend
**Angular 20** moderno (standalone components + signals).

---

## Visao geral

| Camada    | Tecnologia                                              |
|-----------|---------------------------------------------------------|
| Backend   | .NET 9 / ASP.NET Core Web API, EF Core 9 + SQLite, JWT  |
| Frontend  | Angular 20 (standalone + signals), TypeScript estrito   |
| Testes    | xUnit + WebApplicationFactory (EF Core InMemory)        |
| Docs API  | Swagger / OpenAPI (Swashbuckle) com botao Authorize     |

---

## Arquitetura (Hexagonal + DDD + Clean Architecture)

O backend e dividido em projetos por camada, respeitando a **regra de dependencia**
(as setas apontam sempre para dentro, em direcao ao dominio):

```
            +--------------------------------------------------+
            |                  GestaoProjetos.Api              |
            |   (Driving Adapters: Controllers, JWT, Swagger,  |
            |        Middleware, Composition Root / DI)        |
            +-----------------------+--------------------------+
                                    |  depende de
                                    v
            +--------------------------------------------------+
            |             GestaoProjetos.Application            |
            |   (Casos de uso / Services, DTOs, validacoes,     |
            |    PORTS de servico: IServicoSenha, IGeradorToken)|
            +-----------------------+--------------------------+
                                    |  depende de
                                    v
            +--------------------------------------------------+
            |               GestaoProjetos.Domain               |
            |  (Entidades, Value Objects, Enums, Regras de      |
            |   negocio e PORTS de repositorio - sem framework) |
            +-----------------------+--------------------------+
                                    ^  implementa os ports
                                    |
            +--------------------------------------------------+
            |            GestaoProjetos.Infrastructure          |
            |  (Driven Adapters: EF Core DbContext, repositorios|
            |   SQLite, hashing de senha, seed de dados)        |
            +--------------------------------------------------+
```

Principios aplicados:

- **Ports & Adapters**: o dominio define interfaces (`IRepositorio<T>`,
  `IUsuarioRepositorio`, `IUnitOfWork`); a Aplicacao define ports de servico
  (`IServicoSenha`, `IGeradorToken`). Os **adapters** concretos (EF Core, JWT,
  PBKDF2) ficam na Infraestrutura/API e sao injetados via DI.
- **DDD**: entidades ricas com invariantes encapsuladas (construtores e metodos
  de negocio), Value Object `Email`, excecao de dominio `DominioException`.
- **Clean Architecture**: dependencias apontam para o dominio; o dominio nao
  conhece EF Core nem ASP.NET.
- **SOLID**: responsabilidades unicas por classe, inversao de dependencia em
  todas as camadas, interfaces segregadas por agregado.

---

## Entidades de banco e relacionamentos

8 entidades de dominio + 1 tabela de juncao many-to-many:

1. **Usuario** - usuario do sistema (Value Object `Email`, senha com hash).
2. **Equipe** - reune usuarios e e dona dos projetos.
3. **MembroEquipe** - juncao Usuario <-> Equipe, com `PapelMembro`.
4. **Projeto** - pertence a uma Equipe; tem muitas Tarefas e Sprints.
5. **Sprint** - ciclo de trabalho de um Projeto; agrupa Tarefas.
6. **Tarefa** - cartao do Kanban; tem `StatusTarefa` e `PrioridadeTarefa`.
7. **Comentario** - feito por um Usuario em uma Tarefa.
8. **Etiqueta (Tag)** - many-to-many com Tarefa (tabela `TarefaEtiquetas`).
9. **Anexo** - arquivo vinculado a uma Tarefa.

Relacionamentos principais:

```
Equipe 1 ----- * MembroEquipe * ----- 1 Usuario
Equipe 1 ----- * Projeto
Projeto 1 ----- * Sprint
Projeto 1 ----- * Tarefa
Sprint  1 ----- * Tarefa            (Tarefa.SprintId opcional)
Tarefa  1 ----- * Comentario
Tarefa  1 ----- * Anexo
Tarefa  * ----- * Etiqueta          (many-to-many)
Usuario 1 ----- * Comentario        (autor)
Usuario 0..1 -- * Tarefa            (responsavel, opcional)
```

Enums: `StatusTarefa` (Backlog/AFazer/EmAndamento/Concluido),
`PrioridadeTarefa` (Baixa/Media/Alta/Critica),
`StatusProjeto` (Planejado/EmAndamento/Pausado/Concluido/Cancelado),
`PapelMembro` (Membro/Lider/Administrador).

---

## Recursos

- **JWT Bearer**: `POST /api/auth/login` retorna token; endpoints de escrita
  protegidos com `[Authorize]`. Leitura (GETs) liberada para facilitar a demo.
- **Swagger/OpenAPI** em `/swagger` com botao **Authorize** (Bearer).
- **EF Core + SQLite** (arquivo `gestao-projetos.db`), criado via `EnsureCreated`
  e populado por um **seed** (2 projetos, sprint, varias tarefas, etiquetas,
  comentarios).
- **CORS** liberado para `http://localhost:4200`.
- **CRUD por casos de uso** para Projetos, Tarefas, Sprints e Equipes.
- `GET /health` para health check.
- **Angular 20**: standalone components, **signals**, Reactive Forms,
  HttpClient, **HttpInterceptor** (injeta o JWT) e **AuthGuard**.
- **Board Kanban** com **drag and drop** nativo para mover tarefas entre colunas
  (atualizacao otimista + rollback em falha).

---

## Estrutura de pastas

```
gestao-projetos/
├── backend/
│   ├── GestaoProjetos.Domain/          # Entidades, VOs, enums, ports
│   ├── GestaoProjetos.Application/     # Casos de uso, DTOs, ports de servico
│   ├── GestaoProjetos.Infrastructure/ # EF Core, repositorios, seguranca, seed
│   ├── GestaoProjetos.Api/            # Controllers, JWT, Swagger, DI
│   ├── GestaoProjetos.Tests/         # xUnit (integracao via WebApplicationFactory)
│   └── GestaoProjetos.sln
├── frontend/                          # Angular 20 (standalone + signals)
│   └── src/app/{core,features}/
└── README.md
```

---

## Como rodar o backend

Pre-requisitos: **.NET SDK 9**.

```bash
cd backend
dotnet restore
dotnet run --project GestaoProjetos.Api
```

A API sobe em **http://localhost:5000**. O banco SQLite e criado e populado
automaticamente na primeira execucao.

- Swagger / documentacao: **http://localhost:5000/swagger**
- Health check: **http://localhost:5000/health**

Para autenticar no Swagger: faca `POST /api/auth/login`, copie o `token`, clique
em **Authorize** e informe `Bearer {token}`.

---

## Como rodar o frontend

Pre-requisitos: **Node 20+** e **Angular CLI** (ou use `npx`).

```bash
cd frontend
npm install
npm start
```

App disponivel em **http://localhost:4200**. A URL da API e configurada em
`src/environments/environment.ts` (`apiUrl: http://localhost:5000`).

Build de producao:

```bash
npm run build
```

---

## Credenciais de demonstracao

| E-mail            | Senha    | Papel          |
|-------------------|----------|----------------|
| `admin@demo.com`  | `123456` | Administrador   |
| `ana@demo.com`    | `123456` | Lider           |
| `bruno@demo.com`  | `123456` | Membro          |

---

## Como testar

```bash
cd backend
dotnet test
```

Os testes de integracao usam `WebApplicationFactory<Program>` com **EF Core
InMemory** e cobrem: `GET /health`, login (sucesso e falha 401), protecao de
rota sem token, criacao de projeto autenticada, criacao/listagem de tarefa e
movimentacao de tarefa no board.

---

## Endpoints principais

| Metodo | Rota                              | Auth | Descricao                         |
|--------|-----------------------------------|------|-----------------------------------|
| GET    | `/health`                         | Nao  | Health check                      |
| POST   | `/api/auth/login`                 | Nao  | Autentica e retorna JWT           |
| GET    | `/api/projetos`                   | Nao  | Lista projetos                    |
| POST   | `/api/projetos`                   | Sim  | Cria projeto                      |
| PUT    | `/api/projetos/{id}`              | Sim  | Atualiza projeto                  |
| DELETE | `/api/projetos/{id}`              | Sim  | Remove projeto                    |
| GET    | `/api/tarefas?projetoId={id}`     | Nao  | Lista tarefas do projeto          |
| POST   | `/api/tarefas`                    | Sim  | Cria tarefa                       |
| PATCH  | `/api/tarefas/{id}/mover`         | Sim  | Move tarefa entre colunas         |
| DELETE | `/api/tarefas/{id}`               | Sim  | Remove tarefa                     |
| GET    | `/api/sprints?projetoId={id}`     | Nao  | Lista sprints do projeto          |
| POST   | `/api/sprints`                    | Sim  | Cria sprint                       |
| GET    | `/api/equipes`                    | Nao  | Lista equipes                     |
| POST   | `/api/equipes`                    | Sim  | Cria equipe                       |

---

## Docker

Na raiz do projeto:

```bash
docker compose up --build
# API:      http://localhost:5000/swagger
# Frontend: http://localhost:4200
```

`backend/Dockerfile` (multi-stage SDK -> ASP.NET runtime) e `frontend/Dockerfile`
(build Angular servido por nginx).

## Banco de dados: SQLite ou MSSQL

O provider do EF Core é selecionável por configuração (`Database:Provider`):

- **SQLite** (padrão) — zero configuração, ideal para rodar local.
- **SQL Server (MSSQL)** — defina `Database__Provider=SqlServer` e
  `ConnectionStrings__SqlServer=...`. Há um compose pronto:

```bash
docker compose -f docker-compose.mssql.yml up --build   # sobe SQL Server + API + frontend
```

## Kubernetes

```bash
kubectl apply -f k8s/manifests.yaml
```

## CI/CD

- **GitHub Actions:** `.github/workflows/ci.yml` (build + testes .NET, build Angular, build das imagens Docker)
- **GitLab CI:** `.gitlab-ci.yml` (estagios build/test com cobertura)
