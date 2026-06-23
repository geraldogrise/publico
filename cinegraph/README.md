# 🎬 CineGraph — Catálogo de Filmes (GraphQL)

API **GraphQL** em **.NET 9 + HotChocolate** com **frontend React consumindo GraphQL** (urql).
Domínio de catálogo de filmes/séries — relações ricas (filme → gêneros → elenco → avaliações)
que mostram o poder do GraphQL: o cliente pede exatamente os campos e relações que precisa em uma única query.

## 🧩 Stack

| Camada | Tecnologias |
|--------|-------------|
| Backend | .NET 9, HotChocolate (GraphQL), EF Core + SQLite |
| Auth | JWT Bearer (mutation `login`) + `[Authorize]` em mutations protegidas |
| Frontend | React + Vite + TypeScript + **urql** (cliente GraphQL) |
| Testes | xUnit + `WebApplicationFactory` (cobertura ~93%) |

## 🗃️ Entidades

`Movie`, `Genre` (N:N com Movie), `Person`, `CastMember` (elenco: ator/diretor + personagem),
`Review` (nota 1..5) e `User` (autenticação).

## 🔌 Operações GraphQL

**Queries:** `movies` (com `where`/`order`), `movieById`, `searchMovies(term)`, `genres`, `people`.
Campos computados em `Movie`: `averageRating`, `reviewCount`.

**Mutations:** `login` (→ JWT), `addReview` (público), `addMovie` (**requer JWT**).

Exemplo:

```graphql
query {
  movies {
    title
    averageRating
    genres { name }
    cast { person { name } character role }
  }
}
```

## ▶️ Como rodar

### Backend
```bash
cd backend
dotnet run --project CineGraph.Api
# GraphQL IDE (Nitro): http://localhost:5245/graphql
# Health:              http://localhost:5245/health
```
O banco SQLite é criado e populado (seed) automaticamente no primeiro start.

### Frontend
```bash
cd frontend
npm install
npm run dev   # http://localhost:5173 (consome o GraphQL em :5245)
```
O endpoint pode ser alterado via `VITE_GRAPHQL_URL` (veja `.env.example`).

### Testes
```bash
cd backend
dotnet test --collect:"XPlat Code Coverage"
```

## 🔐 Credenciais demo
`admin@demo.com` / `123456` (necessário para a mutation `addMovie`).

## 🐳 Docker
```bash
docker compose up --build
# API:      http://localhost:5245/graphql
# Frontend: http://localhost:5174
```

## ⚙️ CI
- **GitHub Actions:** `.github/workflows/ci.yml`
- **GitLab CI:** `.gitlab-ci.yml`

(ambos rodam build + testes do backend e build do frontend)

## ☸️ Kubernetes
```bash
kubectl apply -f k8s/manifests.yaml
```
